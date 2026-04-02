// USERS ARRAY OR LIST
// This array will hold all registered Users in memory
let users = [
  
];

// LOAD USERS 
// Load users from localStorage when the page starts
function loadUsers(){
  const data = localStorage.getItem("users"); //DEBUGGING OR FINDING DATA IN LOCALSTORAGE
  console.log("Loaded Users from LocaleStorage", data) 
  if(data){
    users = JSON.parse(data)
  }
  console.log("Users List after parsing ", users) //DEBUGGING OR FINDING DATA IN LOCALSTORAGE
}

// SAVE USERS
// Save the current users array into localStorage
function saveUsers(){
  localStorage.setItem("users", JSON.stringify(users))
  console.log("Saved users to localStorage", localStorage.getItem("users")) //DEBUGGING OR FINDING DATA IN LOCALSTORAGE
}

// REGISTER
// Handles user registration
function registerUser(){

  const username = document.getElementById("regUsername").value.trim()
  const password = document.getElementById("regPassword").value.trim()

  if(username === "" || password.length < 7 ){
    alert("Invalid input: username cannot be empty and password must be at least 7 characters")
    return
  }

  const exists = users.find(user => user.username === username)

  if(exists){
    alert("User already exists!");
    return
  }

  users.push(
    {
      username,
      password,
      dob: "",
      bio: "",
      profession: "",
      address: ""
    }
  )
  saveUsers()
  alert("Registered Successfully!")
  console.log("Current users array:", users); // DEBUG
}

function getCurrentUser(){
  const username = localStorage.getItem("currentUser")
  return users.find(u => u.username === username)
}

function renderProfile(user){
  if(!user) return

  document.getElementById("profileUsername").textContent = user.username || "—"
  document.getElementById("profileDob").textContent = user.dob || "—"
  document.getElementById("profileBio").textContent = user.bio || "—"
  document.getElementById("profileProfession").textContent = user.profession || "—"
  document.getElementById("profileAddress").textContent = user.address || "—"

  document.getElementById("editUsername").value = user.username
  document.getElementById("editDob").value = user.dob
  document.getElementById("editBio").value = user.bio
  document.getElementById("editProfession").value = user.profession
  document.getElementById("editAddress").value = user.address
}

function loginUser(){
  const username = document.getElementById("loginUsername").value.trim()
  const password = document.getElementById("loginPassword").value.trim()

  const user = users.find(u => u.username === username)

  if(!user || user.password !== password){
    alert("Invalid Credentials")
    return
  }

  localStorage.setItem("currentUser", username)
  console.log("Current logged-in user:", localStorage.getItem("currentUser")); // DEBUG

  showDashboard(username)
}

function showDashboard(username){
  document.getElementById("registerSection").classList.add("hidden")
  document.getElementById("loginSection").classList.add("hidden")
  document.getElementById("dashboard").classList.remove("hidden")

  document.getElementById("userDisplay").textContent = username
  const user = getCurrentUser()
  renderProfile(user)
  showDashboardSection("profileView")
}

function showDashboardSection(sectionId){
  const sections = ["profileView", "profileEdit"]
  const navButtons = {
    profileView: document.getElementById("navProfileView"),
    profileEdit: document.getElementById("navProfileEdit")
  }

  sections.forEach(section => {
    document.getElementById(section).classList.toggle("hidden", section !== sectionId)
    navButtons[section].classList.toggle("active", section === sectionId)
  })

  if(sectionId === "profileEdit"){
    const user = getCurrentUser()
    renderProfile(user)
  }
}

function saveProfile(){
  const currentUser = localStorage.getItem("currentUser")
  const user = users.find(u => u.username === currentUser)

  if(!user){
    alert("Unable to save profile: no user found.")
    return
  }

  const newUsername = document.getElementById("editUsername").value.trim()
  const dob = document.getElementById("editDob").value
  const bio = document.getElementById("editBio").value.trim()
  const profession = document.getElementById("editProfession").value.trim()
  const address = document.getElementById("editAddress").value.trim()

  if(newUsername === ""){
    alert("Username cannot be empty.")
    return
  }

  if(newUsername !== currentUser && users.some(u => u.username === newUsername)){
    alert("That username is already taken.")
    return
  }

  user.username = newUsername
  user.dob = dob
  user.bio = bio
  user.profession = profession
  user.address = address

  saveUsers()
  localStorage.setItem("currentUser", newUsername)
  document.getElementById("userDisplay").textContent = newUsername
  alert("Profile updated successfully.")
  renderProfile(user)
  showDashboardSection("profileView")
}

loadUsers()

const rememberedUser = localStorage.getItem("currentUser")
if(rememberedUser){
  const existingUser = users.find(u => u.username === rememberedUser)
  if(existingUser){
    showDashboard(rememberedUser)
  }
}

function logoutUser(){
  localStorage.removeItem("currentUser")
  document.getElementById("registerSection").classList.remove("hidden")
  document.getElementById("loginSection").classList.remove("hidden")
  document.getElementById("dashboard").classList.add("hidden")
  document.getElementById("regUsername").value = ""
  document.getElementById("regPassword").value = ""
  document.getElementById("loginUsername").value = ""
  document.getElementById("loginPassword").value = ""
}

function deleteAccount(){
  const currentUser = localStorage.getItem("currentUser")
  if(!currentUser){
    alert("No user is currently logged in.")
    return
  }

  if(!confirm("Are you sure you want to delete your account? This action cannot be undone.")){
    return
  }

  users = users.filter(u => u.username !== currentUser)
  saveUsers()
  logoutUser()
  alert("Account deleted successfully.")
}