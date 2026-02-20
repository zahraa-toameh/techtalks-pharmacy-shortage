from __future__ import annotations

import random
import hashlib
from datetime import datetime, timezone

from sqlalchemy import select

from app.database.session import SessionLocal
from app.database.__init__ import init_db
from app.models.db_models import (
    User,
    UserRole,
    Pharmacy,
    Medication,
    Inventory,
    StockHistory,
)


def hash_password(pw: str) -> str:
    return hashlib.sha256(pw.encode("utf-8")).hexdigest()


def get_or_create_pharmacy(db, name: str, address: str) -> Pharmacy:
    ph = db.execute(select(Pharmacy).where(Pharmacy.name == name)).scalar_one_or_none()
    if ph:
        return ph
    ph = Pharmacy(name=name, address=address)
    db.add(ph)
    db.flush()
    return ph


def get_or_create_medication(db, name: str, manufacturer: str) -> Medication:
    med = db.execute(select(Medication).where(Medication.name == name)).scalar_one_or_none()
    if med:
        return med
    med = Medication(name=name, manufacturer=manufacturer)
    db.add(med)
    db.flush()
    return med


def get_or_create_user(
    db,
    *,
    full_name: str,
    email: str,
    password: str,
    role: UserRole,
    pharmacy_id: int | None = None,
) -> User:
    u = db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if u:
        return u

    u = User(
        full_name=full_name,
        email=email,
        password_hash=hash_password(password),
        role=role,
        pharmacy_id=pharmacy_id,
    )
    db.add(u)
    db.flush()
    return u


def upsert_inventory(db, *, pharmacy_id: int, medication_id: int, quantity: int) -> Inventory:
    inv = db.execute(
        select(Inventory).where(
            Inventory.pharmacy_id == pharmacy_id,
            Inventory.medication_id == medication_id,
        )
    ).scalar_one_or_none()

    if inv is None:
        inv = Inventory(
            pharmacy_id=pharmacy_id,
            medication_id=medication_id,
            quantity=quantity,
        )
        db.add(inv)
        db.flush()
        return inv

    inv.quantity = quantity
    db.flush()
    return inv


def seed_all() -> None:
    # ✅ Create tables FIRST (fixes: relation "users" does not exist)
    init_db()

    db = SessionLocal()
    try:
        print("🌱 Seeding database (idempotent)...")

        pharmacies = [
            get_or_create_pharmacy(db, "Cedars Pharmacy", "Beirut, Hamra"),
            get_or_create_pharmacy(db, "Green Hills Pharmacy", "Tripoli, Mina"),
            get_or_create_pharmacy(db, "Saida Care Pharmacy", "Saida Downtown"),
        ]

        medications = [
            get_or_create_medication(db, "Paracetamol 500mg", "Generic"),
            get_or_create_medication(db, "Ibuprofen 400mg", "Generic"),
            get_or_create_medication(db, "Amoxicillin 500mg", "Generic"),
            get_or_create_medication(db, "Omeprazole 20mg", "Generic"),
            get_or_create_medication(db, "Metformin 500mg", "Generic"),
        ]

        get_or_create_user(
            db,
            full_name="Pharmacist Beirut",
            email="pharmacist1@demo.com",
            password="123456",
            role=UserRole.PHARMACIST,
            pharmacy_id=pharmacies[0].id,
        )
        get_or_create_user(
            db,
            full_name="Pharmacist Tripoli",
            email="pharmacist2@demo.com",
            password="123456",
            role=UserRole.PHARMACIST,
            pharmacy_id=pharmacies[1].id,
        )
        get_or_create_user(
            db,
            full_name="Normal User",
            email="user@demo.com",
            password="123456",
            role=UserRole.USER,
        )

        inventory_rows: list[Inventory] = []
        for ph in pharmacies:
            for med in medications:
                qty = random.randint(0, 100)
                inventory_rows.append(
                    upsert_inventory(
                        db,
                        pharmacy_id=ph.id,
                        medication_id=med.id,
                        quantity=qty,
                    )
                )

        # Optional: add a few history rows (sample)
        sample = random.sample(inventory_rows, k=min(5, len(inventory_rows)))
        for inv in sample:
            db.add(
                StockHistory(
                    pharmacy_id=inv.pharmacy_id,
                    medication_id=inv.medication_id,
                    old_quantity=max(0, inv.quantity - 10),
                    new_quantity=inv.quantity,
                    changed_at=datetime.now(timezone.utc),
                    reason="initial seed",
                )
            )

        db.commit()
        print("✅ Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print("❌ Seeding failed:", e)
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_all()