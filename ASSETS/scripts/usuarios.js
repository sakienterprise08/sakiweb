(() => {
  const STORAGE_KEY = "saki_admin_users_v1";
  const adminProfileKey = "saki_admin_profile_v1";
  const starterUsers = [
    {id:1,name:"Laura Gómez",document:"1032456789",email:"laura.gomez@correo.com",phone:"300 456 7890",role:"Usuario general",status:"Activo",address:"Medellín, Antioquia",notes:"Tiene una mascota registrada."},
    {id:2,name:"Mateo Restrepo",document:"1002456781",email:"mateo.restrepo@correo.com",phone:"301 234 5678",role:"Usuario general",status:"Activo",address:"Envigado, Antioquia",notes:"Cliente frecuente."},
    {id:3,name:"Tienda Patitas Felices",document:"901234567",email:"contacto@patitasfelices.co",phone:"604 444 1200",role:"Tienda",status:"Activo",address:"Laureles, Medellín",notes:"Tienda de productos para mascotas."},
    {id:4,name:"Refugio Huellas de Amor",document:"901345678",email:"hola@huellasdeamor.org",phone:"300 888 1212",role:"Refugio de mascotas",status:"Activo",address:"Robledo, Medellín",notes:"Refugio y centro de adopción."},
    {id:5,name:"Spa Colitas",document:"901456789",email:"citas@spacolitas.co",phone:"310 456 7891",role:"Spa para mascotas",status:"Activo",address:"Belén, Medellín",notes:"Baño, peluquería y cuidado."},
    {id:6,name:"Veterinaria Buen Amigo",document:"901567890",email:"info@buenamigo.vet",phone:"604 555 0188",role:"Veterinaria",status:"Activo",address:"El Poblado, Medellín",notes:"Servicios veterinarios."},
    {id:7,name:"Valentina Ruiz",document:"43210987",email:"valentina.ruiz@correo.com",phone:"302 555 1020",role:"Usuario general",status:"Activo",address:"Medellín, Antioquia",notes:"Tiene dos mascotas registradas."},
    {id:8,name:"Mundo Animal",document:"901678901",email:"ventas@mundoanimal.co",phone:"604 444 2233",role:"Tienda",status:"Activo",address:"Itagüí, Antioquia",notes:"Tienda de alimentos y accesorios."},
    {id:9,name:"Fundación Patas Seguras",document:"901789012",email:"adopciones@patasseguras.org",phone:"301 777 2020",role:"Refugio de mascotas",status:"Activo",address:"Bello, Antioquia",notes:"Rescate y adopción responsable."},
    {id:10,name:"Spa Mimos Peludos",document:"901890123",email:"hola@mimospeludos.co",phone:"315 222 9090",role:"Spa para mascotas",status:"Activo",address:"Envigado, Antioquia",notes:"Spa y estética canina y felina."},
    {id:11,name:"Centro Veterinario Arca",document:"902001234",email:"agenda@arca.vet",phone:"604 333 4455",role:"Veterinaria",status:"Activo",address:"Sabaneta, Antioquia",notes:"Consulta general y vacunación."},
    {id:12,name:"Andrés Pérez",document:"1023456789",email:"andres.perez@correo.com",phone:"320 456 7001",role:"Usuario general",status:"Inactivo",address:"Medellín, Antioquia",notes:"Cuenta inactiva."},
    {id:13,name:"Pet Market Antioquia",document:"902112345",email:"contacto@petmarket.co",phone:"304 333 2020",role:"Tienda",status:"Activo",address:"Centro, Medellín",notes:"Comercio de productos para mascotas."},
    {id:14,name:"Refugio Nuevo Hogar",document:"902223456",email:"equipo@nuevohogar.org",phone:"300 111 9090",role:"Refugio de mascotas",status:"Activo",address:"Copacabana, Antioquia",notes:"Hogar temporal y adopciones."},
    {id:15,name:"Clínica Veterinaria Vida Animal",document:"902334567",email:"recepcion@vidaanimal.vet",phone:"604 222 1010",role:"Veterinaria",status:"Activo",address:"La América, Medellín",notes:"Clínica veterinaria."},
    {id:16,name:"Administrador SAKI",document:"1000000001",email:"admin@saki.com",phone:"300 000 0000",role:"Administrador",status:"Activo",address:"Medellín, Antioquia",notes:"Cuenta administrativa de ejemplo."}
  ];
  let users = loadUsers();
  let pendingDeleteId = null;
  const formModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("userFormModal"));
  const detailsModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("userDetailsModal"));
  const deleteModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("deleteUserModal"));
  const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById("appToast"), {delay:2600});

  function loadUsers(){
    try { const saved=localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : starterUsers.map(u=>({...u})); }
    catch(e){ return starterUsers.map(u=>({...u})); }
  }
  function saveUsers(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(users)); }
  function initials(name){ return String(name||"").trim().split(/\s+/).slice(0,2).map(part=>part[0]||"").join("").toUpperCase() || "US"; }
  function roleClass(role){
    const classes = {
      "Usuario general":"role-general",
      "Tienda":"role-tienda",
      "Refugio de mascotas":"role-refugio",
      "Spa para mascotas":"role-spa",
      "Veterinaria":"role-veterinaria",
      "Administrador":"role-general"
    };
    return classes[role] || "role-general";
  }
  function escapeHtml(value){ return String(value??"").replace(/[&<>"']/g, char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char])); }
  function showToast(message){ document.getElementById("toastMessage").textContent=message; toast.show(); }
  function render(){
    const query=document.getElementById("userSearch").value.trim().toLowerCase();
    const filtered=users.filter(u=>[u.name,u.email,u.document,u.phone,u.role].some(v=>String(v||"").toLowerCase().includes(query)));
    document.getElementById("totalUsers").textContent=users.length;
    document.getElementById("adminUsers").textContent=users.filter(u=>u.role==="Administrador").length;
    document.getElementById("clientUsers").textContent=users.filter(u=>u.role==="Usuario general").length;
    document.getElementById("usersTableBody").innerHTML=filtered.map(u=>`
      <tr>
        <td><div class="d-flex align-items-center gap-3"><div class="user-avatar">${escapeHtml(initials(u.name))}</div><div><div class="user-name">${escapeHtml(u.name)}</div><div class="user-email">${escapeHtml(u.email)}</div></div></div></td>
        <td>${escapeHtml(u.document)}</td><td>${escapeHtml(u.phone||"—")}</td>
        <td><span class="role-badge ${roleClass(u.role)}">${escapeHtml(u.role)}</span></td>
        <td><span class="pill" style="${u.status==="Inactivo"?"background:#f8e7e7;color:#a45151":""}">${escapeHtml(u.status)}</span></td>
        <td><div class="d-flex justify-content-end gap-1">
          <button class="action-btn" title="Ver información" aria-label="Ver ${escapeHtml(u.name)}" data-action="view" data-id="${u.id}"><i class="bi bi-eye"></i></button>
          <button class="action-btn" title="Editar usuario" aria-label="Editar ${escapeHtml(u.name)}" data-action="edit" data-id="${u.id}"><i class="bi bi-pencil"></i></button>
          <button class="action-btn delete" title="Eliminar usuario" aria-label="Eliminar ${escapeHtml(u.name)}" data-action="delete" data-id="${u.id}"><i class="bi bi-trash3"></i></button>
        </div></td>
      </tr>`).join("");
    document.getElementById("emptyUsers").classList.toggle("d-none",filtered.length!==0);
  }
  function resetForm(){
    document.getElementById("userForm").reset();
    document.getElementById("userId").value="";
    document.getElementById("userFormTitle").textContent="Registrar usuario";
  }
  function openCreate(){
    resetForm();
    document.getElementById("userFormTitle").textContent="Registrar usuario";
  }
  function openEdit(id){
    const u=users.find(item=>String(item.id)===String(id)); if(!u)return;
    resetForm();
    document.getElementById("userFormTitle").textContent="Editar usuario";
    document.getElementById("userId").value=u.id;
    document.getElementById("userFullName").value=u.name||"";
    document.getElementById("userDocument").value=u.document||"";
    document.getElementById("userEmail").value=u.email||"";
    document.getElementById("userPhone").value=u.phone||"";
    document.getElementById("userRole").value=u.role||"Cliente";
    document.getElementById("userStatus").value=u.status||"Activo";
    document.getElementById("userAddress").value=u.address||"";
    document.getElementById("userNotes").value=u.notes||"";
    formModal.show();
  }
  function openDetails(id){
    const u=users.find(item=>String(item.id)===String(id)); if(!u)return;
    document.getElementById("userDetailsTitle").textContent=u.name;
    const rows=[["Documento",u.document],["Correo electrónico",u.email],["Teléfono",u.phone],["Rol",u.role],["Estado",u.status],["Dirección",u.address],["Notas",u.notes]];
    document.getElementById("userDetailsBody").innerHTML=`<div class="d-flex align-items-center gap-3 mb-4"><div class="avatar-large">${escapeHtml(initials(u.name))}</div><div><h3 class="h5 mb-1">${escapeHtml(u.name)}</h3><div class="profile-meta">${escapeHtml(u.email)}</div></div></div>${rows.map(([label,value])=>`<div class="py-2 border-bottom"><div class="small text-secondary">${escapeHtml(label)}</div><div class="fw-semibold">${escapeHtml(value||"—")}</div></div>`).join("")}`;
    detailsModal.show();
  }
  function requestDelete(id){
    const u=users.find(item=>String(item.id)===String(id)); if(!u)return;
    pendingDeleteId=u.id;
    document.getElementById("deleteUserMessage").textContent=`¿Seguro que deseas eliminar a ${u.name}? Esta acción no se puede deshacer.`;
    deleteModal.show();
  }
  document.getElementById("createUserBtn").addEventListener("click",openCreate);
  document.getElementById("userSearch").addEventListener("input",render);
  document.getElementById("usersTableBody").addEventListener("click",event=>{
    const button=event.target.closest("button[data-action]"); if(!button)return;
    const {action,id}=button.dataset;
    if(action==="view")openDetails(id);
    if(action==="edit")openEdit(id);
    if(action==="delete")requestDelete(id);
  });
  document.getElementById("userForm").addEventListener("submit",event=>{
    event.preventDefault();
    const id=document.getElementById("userId").value;
    const record={
      id:id ? Number(id) : (users.length ? Math.max(...users.map(u=>Number(u.id)||0))+1 : 1),
      name:document.getElementById("userFullName").value.trim(),
      document:document.getElementById("userDocument").value.trim(),
      email:document.getElementById("userEmail").value.trim(),
      phone:document.getElementById("userPhone").value.trim(),
      role:document.getElementById("userRole").value,
      status:document.getElementById("userStatus").value,
      address:document.getElementById("userAddress").value.trim(),
      notes:document.getElementById("userNotes").value.trim()
    };
    const duplicate=users.some(u=>String(u.id)!==String(record.id)&&(u.email.toLowerCase()===record.email.toLowerCase()||u.document===record.document));
    if(duplicate){showToast("Ya existe un usuario con ese correo o documento.");return;}
    if(id){users=users.map(u=>String(u.id)===String(id)?record:u);showToast("Información del usuario actualizada.");}
    else{users.push(record);showToast("Usuario registrado correctamente.");}
    saveUsers();render();formModal.hide();
  });
  document.getElementById("confirmDeleteUser").addEventListener("click",()=>{
    if(pendingDeleteId===null)return;
    users=users.filter(u=>String(u.id)!==String(pendingDeleteId));
    saveUsers();render();pendingDeleteId=null;deleteModal.hide();showToast("Usuario eliminado.");
  });
  const adminProfileModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("adminProfileModal"));
  document.getElementById("editAdminBtn").addEventListener("click",()=>{
    let profile={name:"Isaac Sánchez",email:"admin@saki.com"};
    try{profile={...profile,...JSON.parse(localStorage.getItem(adminProfileKey)||"{}")};}catch(e){}
    document.getElementById("adminProfileName").value=profile.name;
    document.getElementById("adminProfileEmail").value=profile.email;
  });
  document.getElementById("adminProfileForm").addEventListener("submit",event=>{
    event.preventDefault();
    const profile={
      name:document.getElementById("adminProfileName").value.trim(),
      email:document.getElementById("adminProfileEmail").value.trim()
    };
    if(!profile.name||!profile.email){showToast("El nombre y el correo son obligatorios.");return;}
    localStorage.setItem(adminProfileKey,JSON.stringify(profile));
    updateAdminProfile(profile);
    adminProfileModal.hide();
    showToast("Perfil de administrador actualizado.");
  });
  function updateAdminProfile(profile){
    document.getElementById("adminName").textContent=profile.name;
    document.getElementById("adminEmail").textContent=profile.email;
    document.getElementById("adminAvatar").textContent=initials(profile.name);
  }
  try{updateAdminProfile({...{name:"Isaac Sánchez",email:"admin@saki.com"},...JSON.parse(localStorage.getItem(adminProfileKey)||"{}")});}catch(e){}
  render();
})();
