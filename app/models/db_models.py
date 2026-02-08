from __future__ import annotations

from datetime import datetime
from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
    Index,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Pharmacy(Base):
    __tablename__ = "pharmacies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)

    inventory_items: Mapped[list["Inventory"]] = relationship(
        back_populates="pharmacy", cascade="all, delete-orphan"
    )


class Medication(Base):
    __tablename__ = "medications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    manufacturer: Mapped[str | None] = mapped_column(String(255), nullable=True)

    inventory_items: Mapped[list["Inventory"]] = relationship(
        back_populates="medication", cascade="all, delete-orphan"
    )


class Inventory(Base):
    """
    MUST match services expectation:
    pharmacy_id, medication_id, quantity
    """
    __tablename__ = "inventory"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    pharmacy_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("pharmacies.id", ondelete="CASCADE"), nullable=False
    )
    medication_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("medications.id", ondelete="CASCADE"), nullable=False
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    pharmacy: Mapped["Pharmacy"] = relationship(back_populates="inventory_items")
    medication: Mapped["Medication"] = relationship(back_populates="inventory_items")

    __table_args__ = (
        UniqueConstraint("pharmacy_id", "medication_id", name="uq_inventory_pair"),
        Index("ix_inventory_pharmacy_med", "pharmacy_id", "medication_id"),
    )


class StockHistory(Base):
    __tablename__ = "stock_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    pharmacy_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("pharmacies.id", ondelete="CASCADE"), nullable=False
    )
    medication_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("medications.id", ondelete="CASCADE"), nullable=False
    )

    old_quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    new_quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    changed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    reason: Mapped[str | None] = mapped_column(String(255), nullable=True)
