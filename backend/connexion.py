import sqlite3

def get_db_connection():
  """
  Établit une connexion à la base de données SQLite spécifiée.

  Returns:
    sqlite3.Connection: Un objet de connexion à la base de données.
  """
  conn = None
  try:
    conn = sqlite3.connect('./sql/base.db')
  except sqlite3.Error as e:
    print(e)
  return conn