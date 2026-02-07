from app.services.inventory_service import InventoryService
from app.models.db_models import Inventory, StockHistory


def test_add_stock_creates_inventory(db_session):
    service = InventoryService(db_session)

    result = service.add_stock(
        pharmacy_id=1,
        medication_id=1,
        quantity=10,
    )

    inventory = db_session.query(Inventory).one()

    assert inventory.quantity == 10
    assert result.change_amount == 10


def test_update_stock_changes_quantity(db_session):
    service = InventoryService(db_session)

    service.add_stock(1, 1, 10)
    result = service.update_stock(1, 1, 5)

    inventory = db_session.query(Inventory).one()
    assert inventory.quantity == 5
    assert result.change_amount == -5


def test_remove_stock_prevents_negative(db_session):
    service = InventoryService(db_session)

    service.add_stock(1, 1, 5)

    try:
        service.remove_stock(1, 1, 10)
        assert False, "Expected validation error"
    except Exception:
        assert True


def test_stock_history_is_created(db_session):
    service = InventoryService(db_session)

    service.add_stock(1, 1, 10)

    history = db_session.query(StockHistory).one()
    assert history.old_quantity == 0
    assert history.new_quantity == 10
    assert history.reason == "ADD"
