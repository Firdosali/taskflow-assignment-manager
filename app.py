from flask import Flask, request, jsonify, render_template
import sqlite3

app = Flask(__name__)

def get_db():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/assignments', methods=['GET'])
def get_assignments():
    conn = get_db()
    data = conn.execute('SELECT * FROM assignments').fetchall()
    conn.close()
    return jsonify([dict(row) for row in data])

@app.route('/assignments', methods=['POST'])
def add_assignment():
    data = request.json
    conn = get_db()
    conn.execute(
        'INSERT INTO assignments (title, subject, deadline, status) VALUES (?, ?, ?, ?)',
        (data['title'], data['subject'], data['deadline'], 'Pending')
    )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Added successfully'})

@app.route('/assignments/<int:id>', methods=['PUT'])
def update_assignment(id):
    data = request.json
    conn = get_db()
    conn.execute(
        'UPDATE assignments SET status=? WHERE id=?',
        (data['status'], id)
    )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Updated successfully'})

@app.route('/assignments/<int:id>', methods=['DELETE'])
def delete_assignment(id):
    conn = get_db()
    conn.execute('DELETE FROM assignments WHERE id=?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Deleted successfully'})

if __name__ == '__main__':
    conn = sqlite3.connect('database.db')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            subject TEXT,
            deadline TEXT,
            status TEXT
        )
    ''')
    conn.close()

    app.run(debug=True, use_reloader=False)