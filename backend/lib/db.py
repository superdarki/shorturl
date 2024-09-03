import sqlite3

class DB:

    def __init__(self, db_name: str):
        self.con = sqlite3.connect(db_name)
        self.cur = self.con.cursor()

        self.cur.execute("CREATE TABLE IF NOT EXISTS short(id VARCHAR(11) PRIMARY KEY, url TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
        self.con.commit()

    def getall(self):
        res = self.cur.execute("SELECT id, url, created_at FROM short")
        return res.fetchall()

    def get(self, id: str):
        res = self.cur.execute("SELECT url FROM short WHERE id = ?", (id,))
        v = res.fetchone()
        return v[0] if v else None

    def add(self, id: str, url: str):
        self.cur.execute("INSERT INTO short (id, url) VALUES(?, ?)", (id, url))
        self.con.commit()
