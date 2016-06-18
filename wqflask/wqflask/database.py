from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from wqflask import app

#engine = create_engine('sqlite:////tmp/test.db', convert_unicode=True)
engine = create_engine(app.config['DB_URI'], convert_unicode=True)

db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()

import utility.logger
logger = utility.logger.getLogger(__name__ )

def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    #import yourapplication.models
    import wqflask.model
    logger.debug("database.py: Creating all model metadata..")
    Base.metadata.create_all(bind=engine)
    logger.info("database.py: Done creating all model metadata...")
    logger.info("Point your browser at http://localhost:5003/")

init_db()
