from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.db_models import Inventory, StockHistory


class InventoryServiceError(Exception):
    """Base exception for inventory-related errors."""


class InventoryNotFoundError(InventoryServiceError):
    """Raised when inventory record is not found."""


class InventoryValidationError(InventoryServiceError):
    """Raised when validation fails."""


@dataclass(frozen=True)
class InventoryChangeResult:
    pharmacy_id: int
    medication_id: int
    previous_quantity: int
    new_quantity: int
    change_amount: int
    changed_at: datetime


class InventoryService:
    """
    Business logic for inventory management.
    """

    def __init__(self, db: Session) -> None:
        self.db = db

    # ---------- helpers ----------

    def _get_inventory(
        self,
        pharmacy_id: int,
        medication_id: int,
    ) -> Inventory | None:
        return (
            self.db.query(Inventory)
            .filter(
                Inventory.pharmacy_id == pharmacy_id,
                Inventory.medication_id == medication_id,
            )
            .one_or_none()
        )

    def _validate_positive(self, value: int, name: str) -> None:
        if value <= 0:
            raise InventoryValidationError(f"{name} must be > 0")

    def _validate_non_negative(self, value: int, name: str) -> None:
        if value < 0:
            raise InventoryValidationError(f"{name} must be >= 0")

    def _log_history(
        self,
        pharmacy_id: int,
        medication_id: int,
        previous: int,
        new: int,
        action: str,
    ) -> None:
        history = StockHistory(
            pharmacy_id=pharmacy_id,
            medication_id=medication_id,
            previous_quantity=previous,
            new_quantity=new,
            change_amount=new - previous,
            action=action,
            created_at=datetime.utcnow(),
        )
        self.db.add(history)

    # ---------- public API ----------

    def add_stock(
        self,
        pharmacy_id: int,
        medication_id: int,
        quantity: int,
    ) -> InventoryChangeResult:
        self._validate_positive(quantity, "quantity")

        inventory = self._get_inventory(pharmacy_id, medication_id)
        now = datetime.utcnow()

        if inventory is None:
            previous = 0
            inventory = Inventory(
                pharmacy_id=pharmacy_id,
                medication_id=medication_id,
                quantity=quantity,
            )
            self.db.add(inventory)
            new = quantity
        else:
            previous = inventory.quantity
            inventory.quantity += quantity
            new = inventory.quantity

        self._log_history(
            pharmacy_id,
            medication_id,
            previous,
            new,
            action="ADD",
        )

        self.db.commit()
        self.db.refresh(inventory)

        return InventoryChangeResult(
            pharmacy_id,
            medication_id,
            previous,
            new,
            new - previous,
            now,
        )

    def update_stock(
        self,
        pharmacy_id: int,
        medication_id: int,
        new_quantity: int,
    ) -> InventoryChangeResult:
        self._validate_non_negative(new_quantity, "new_quantity")

        inventory = self._get_inventory(pharmacy_id, medication_id)
        now = datetime.utcnow()

        if inventory is None:
            previous = 0
            inventory = Inventory(
                pharmacy_id=pharmacy_id,
                medication_id=medication_id,
                quantity=new_quantity,
            )
            self.db.add(inventory)
        else:
            previous = inventory.quantity
            inventory.quantity = new_quantity

        self._log_history(
            pharmacy_id,
            medication_id,
            previous,
            new_quantity,
            action="UPDATE",
        )

        self.db.commit()
        self.db.refresh(inventory)

        return InventoryChangeResult(
            pharmacy_id,
            medication_id,
            previous,
            new_quantity,
            new_quantity - previous,
            now,
        )

    def remove_stock(
        self,
        pharmacy_id: int,
        medication_id: int,
        quantity: int,
    ) -> InventoryChangeResult:
        self._validate_positive(quantity, "quantity")

        inventory = self._get_inventory(pharmacy_id, medication_id)
        if inventory is None:
            raise InventoryNotFoundError("Inventory record not found")

        previous = inventory.quantity
        new = previous - quantity

        if new < 0:
            raise InventoryValidationError(
                "Cannot remove more stock than available"
            )

        inventory.quantity = new

        self._log_history(
            pharmacy_id,
            medication_id,
            previous,
            new,
            action="REMOVE",
        )

        self.db.commit()
        self.db.refresh(inventory)

        return InventoryChangeResult(
            pharmacy_id,
            medication_id,
            previous,
            new,
            new - previous,
            datetime.utcnow(),
        )
