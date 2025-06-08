document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Obtener y mostrar actividades
  async function fetchActivities() {
    const res = await fetch('/activities');
    const data = await res.json();
    const list = document.getElementById('activities-list');
    list.innerHTML = '';
    Object.entries(data).forEach(([name, info]) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${name}</strong>: ${info.description}<br>
            <em>${info.schedule}</em><br>
            Participantes: ${info.participants.length}/${info.max_participants}
            <form onsubmit="signup(event, '${name}')">
                <input type="email" name="email" placeholder="Tu email" required>
                <button type="submit">Apuntarse</button>
            </form>
            <hr>
        `;
        list.appendChild(li);
    });
  }

  // Registrar estudiante en una actividad
  async function signup(event, activityName) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const res = await fetch(`/activities/${encodeURIComponent(activityName)}/signup?email=${encodeURIComponent(email)}`, {
        method: 'POST'
    });
    if (res.ok) {
        alert('¡Inscripción exitosa!');
        fetchActivities();
    } else {
        const err = await res.json();
        alert('Error: ' + err.detail);
    }
    form.reset();
  }

  // Inicializar al cargar
  window.onload = fetchActivities;
});
