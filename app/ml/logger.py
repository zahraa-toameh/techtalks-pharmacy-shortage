import logging

logger = logging.getLogger("ml")
logger.setLevel(logging.INFO)
ch = logging.StreamHandler()
formatter = logging.Formatter("[%(levelname)s] %(message)s")
ch.setFormatter(formatter)
logger.addHandler(ch)
