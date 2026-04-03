function formatDate(date) {
    return new Date(date).toLocaleDateString()
}

async function loadAssignments() {
    const res = await fetch('/assignments')
    const data = await res.json()

    const table = document.getElementById('table')
    table.innerHTML = ''

    let completed = 0

    data.forEach(a => {
        if (a.status === 'Completed') completed++

        const tr = document.createElement('tr')

tr.innerHTML = `
    <td>${a.title}</td>
    <td>${a.subject}</td>
    <td>${new Date(a.deadline).toLocaleString()}</td>

    <td>
        <span class="status ${a.status === 'Completed' ? 'done' : 'pending'}">
            ${a.status}
        </span>
    </td>

    <td>
        <button class="toggle-btn" onclick="toggleStatus(${a.id}, '${a.status}')">
            ${a.status === 'Pending' ? '✔ Mark Done' : '↩ Undo'}
        </button>

        <button class="delete-btn" onclick="deleteAssignment(${a.id})">
            🗑 Delete
        </button>
    </td>
`

        table.appendChild(tr)
    })

    document.getElementById('total').innerText = data.length
    document.getElementById('completed').innerText = completed
}

async function addAssignment() {
    const title = document.getElementById('title').value.trim()
    const subject = document.getElementById('subject').value.trim()
    const deadline = document.getElementById('deadline').value

    if (!title || !subject || !deadline) {
        alert("Please fill all fields!")
        return
    }

    await fetch('/assignments', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, subject, deadline})
    })

    document.getElementById('title').value = ''
    document.getElementById('subject').value = ''
    document.getElementById('deadline').value = ''

    loadAssignments()
}

async function deleteAssignment(id) {
    await fetch('/assignments/' + id, {method: 'DELETE'})
    loadAssignments()
}

async function toggleStatus(id, status) {
    const newStatus = status === 'Pending' ? 'Completed' : 'Pending'

    await fetch('/assignments/' + id, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({status: newStatus})
    })

    loadAssignments()
}

document.getElementById('today').innerText = new Date().toDateString()

loadAssignments()
