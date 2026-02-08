from __future__ import annotations

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.db_models import Pharmacy, Medication, Inventory, StockHistory


# ---------- Generic helper ----------
def add_and_commit(db: Session, obj):
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# ---------- Pharmacy ----------
def create_pharmacy(db: Session, name: str, address: str | None = None) -> Pharmacy:
    return add_and_commit(db, Pharmacy(name=name, address=address))


def list_pharmacies(db: Session) -> list[Pharmacy]:
    return list(db.scalars(select(Pharmacy)).all())


# ---------- Medication ----------
def create_medication(db: Session, name: str, manufacturer: str | None = None) -> Medication:
    return add_and_commit(db, Medication(name=name, manufacturer=manufacturer))


def list_medications(db: Session) -> list[Medication]:
    return list(db.scalars(select(Medication)).all())


# ---------- Inventory ----------
def list_inventory(db: Session) -> list[Inventory]:
    """
    Services expect querying all inventory rows.
    """
    return list(db.scalars(select(Inventory)).all())


def get_inventory_row(db: Session, pharmacy_id: int, medication_id: int) -> Inventory | None:
    stmt = select(Inventory).where(
        Inventory.pharmacy_id == pharmacy_id,
        Inventory.medication_id == medication_id,
    )
    return db.scalars(stmt).first()


def upsert_inventory_quantity(
    db: Session,
    pharmacy_id: int,
    medication_id: int,
    new_quantity: int,
    reason: str | None = None,
) -> Inventory:
    """
    Creates inventory row if missing; otherwise updates quantity.
    Writes StockHistory each change.
    """
    if new_quantity < 0:
        raise ValueError("new_quantity cannot be negative")

    row = get_inventory_row(db, pharmacy_id, medication_id)

    if row is None:
        row = Inventory(
            pharmacy_id=pharmacy_id,
            medication_id=medication_id,
            quantity=new_quantity,
        )
        db.add(row)
        db.flush()  # get row.id without committing

        db.add(
            StockHistory(
                pharmacy_id=pharmacy_id,
                medication_id=medication_id,
                old_quantity=0,
                new_quantity=new_quantity,
                reason=reason,
            )
        )
        db.commit()
        db.refresh(row)
        return row

    old = row.quantity
    row.quantity = new_quantity

    db.add(
        StockHistory(
            pharmacy_id=pharmacy_id,
            medication_id=medication_id,
            old_quantity=old,
            new_quantity=new_quantity,
            reason=reason,
        )
    )
    db.commit()
    db.refresh(row)
    return row
