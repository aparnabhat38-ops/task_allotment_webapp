import sqlite3

conn = sqlite3.connect("taskallotment.db")
cursor = conn.cursor()

cursor.execute("""
UPDATE users
SET role = 'trainee'
WHERE role IS NULL
""")

conn.commit()

print("Rows updated:", cursor.rowcount)

conn.close()