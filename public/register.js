import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_1KNu8igoG60o-OejxQdEbuqP1gCLSAo",
  authDomain: "unity-19852.firebaseapp.com",
  projectId: "unity-19852",
  storageBucket: "unity-19852.appspot.com",
  messagingSenderId: "345194493851",
  appId: "1:345194493851:web:e144902274a7dda622933e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function initializeAuth() {
  console.log("initializeAuth function called");

  const authModal = document.getElementById('authModal');
  const authForm = document.getElementById('authForm');
  const modalTitle = document.getElementById('modalTitle');
  const switchLink = document.getElementById('switchLink');
  const switchText = document.getElementById('switchText');
  const errorMessage = document.createElement('div');
  errorMessage.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 hidden';
  if (authForm) authForm.appendChild(errorMessage);

  const signOutButton = document.getElementById('signOutButton');
  const mobileSignOutButton = document.getElementById('mobileSignOutButton');

  let isSignIn = false;


  const userTypeSelect = document.createElement('select');
  userTypeSelect.id = 'userType';
  userTypeSelect.className = 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50';
  userTypeSelect.innerHTML = `
    <option value="public">General Public</option>
    <option value="staff">Government Staff</option>
    <option value="official">Government Official</option>
  `;

  function openAuthModal() {
    console.log("Opening auth modal");
    if (authModal) authModal.classList.remove('hidden');
    updateModalContent();
  }

  function closeAuthModal() {
    console.log("Closing auth modal");
    if (authModal) authModal.classList.add('hidden');
  }

  function redirectToGetStarted() {
    // Instead of redirecting, we'll show the Get Started button and hide the Sign In button
    updateAuthButtons(true);
    closeAuthModal();
  }

  function updateAuthButtons(isLoggedIn) {
    const authButtons = document.querySelectorAll('#authButton, #mobileAuthButton, #heroAuthButton');
    const getStartedButtons = document.querySelectorAll('#getStartedButton, #mobileGetStartedButton, #heroGetStartedButton');
    const signOutButtons = document.querySelectorAll('#signOutButton, #mobileSignOutButton');
    const loadingButtons = document.querySelectorAll('#loadingButton, #mobileLoadingButton, #heroLoadingButton');
    
    loadingButtons.forEach(button => {
      if (button) button.style.display = 'none';
    });

    authButtons.forEach(button => {
      if (button) button.style.display = isLoggedIn ? 'none' : 'block';
    });
    getStartedButtons.forEach(button => {
      if (button) button.style.display = isLoggedIn ? 'block' : 'none';
    });
    signOutButtons.forEach(button => {
      if (button) button.style.display = isLoggedIn ? 'block' : 'none';
    });
  }

  function updateModalContent() {
    if (modalTitle) modalTitle.textContent = isSignIn ? 'Sign In' : 'Sign Up';
    if (switchText) switchText.textContent = isSignIn ? "Don't have an account?" : "Already have an account?";
    if (switchLink) switchLink.textContent = isSignIn ? 'Sign Up' : 'Sign In';
    
    const userTypeContainer = document.getElementById('userTypeContainer');
    if (userTypeContainer) {
      userTypeContainer.innerHTML = '<label for="userType" class="block text-sm font-medium text-gray-700">User Type</label>';
      userTypeContainer.appendChild(userTypeSelect);
    }

    // Create additionalFields container if it doesn't exist
    let additionalFieldsContainer = document.getElementById('additionalFields');
    if (!additionalFieldsContainer) {
      additionalFieldsContainer = document.createElement('div');
      additionalFieldsContainer.id = 'additionalFields';
      authForm.insertBefore(additionalFieldsContainer, authForm.querySelector('button[type="submit"]'));
    }

    updateAdditionalFields();
  }

  function updateAdditionalFields() {
    const additionalFieldsContainer = document.getElementById('additionalFields');
    if (!additionalFieldsContainer) return;

    const userType = userTypeSelect.value;
    let additionalFieldsHTML = '';

    switch (userType) {
      case 'public':
        additionalFieldsHTML = `
          <div>
            <label for="aadhar" class="block text-sm font-medium text-gray-700">Aadhar Number</label>
            <input type="text" id="aadhar" pattern="[0-9]{12}" minlength="12" maxlength="12" required 
                   placeholder="Enter 12-digit Aadhar number"
                   class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
        `;
        break;
      case 'staff':
        additionalFieldsHTML = `
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" id="username" required 
                   placeholder="Enter your username"
                   class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label for="govPin" class="block text-sm font-medium text-gray-700">Government Mandated PIN</label>
            <input type="text" id="govPin" pattern="[0-9]{8}" minlength="8" maxlength="8" required 
                   placeholder="Enter 8-digit government PIN"
                   class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
        `;
        break;
      case 'official':
        additionalFieldsHTML = `
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" id="username" required 
                   placeholder="Enter your username"
                   class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label for="govToken" class="block text-sm font-medium text-gray-700">Government Issued Token</label>
            <input type="text" id="govToken" pattern="[a-zA-Z0-9]{10,}" minlength="10" required 
                   placeholder="Enter government token (min. 10 alphanumeric characters)"
                   class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
        `;
        break;
    }

    additionalFieldsContainer.innerHTML = additionalFieldsHTML;
  }

  const authButton = document.getElementById('authButton');
  const mobileAuthButton = document.getElementById('mobileAuthButton');
  const heroAuthButton = document.getElementById('heroAuthButton');
  const closeModalButton = document.getElementById('closeModal');

  if (authButton) authButton.addEventListener('click', openAuthModal);
  if (mobileAuthButton) mobileAuthButton.addEventListener('click', openAuthModal);
  if (heroAuthButton) heroAuthButton.addEventListener('click', openAuthModal);
  if (closeModalButton) closeModalButton.addEventListener('click', closeAuthModal);

  if (switchLink) {
    switchLink.addEventListener('click', (e) => {
      e.preventDefault();
      isSignIn = !isSignIn;
      updateModalContent();
      errorMessage.classList.add('hidden');
    });
  }

  if (userTypeSelect) {
    userTypeSelect.addEventListener('change', updateAdditionalFields);
  }

  function handleSignOut() {
    signOut(auth).then(() => {
      console.log('User signed out successfully');
      updateAuthButtons(false);
      window.location.href = 'index.html';
    }).catch((error) => {
      console.error('Error signing out:', error);
      showError('An error occurred while signing out.');
    });
  }

  if (signOutButton) {
    signOutButton.addEventListener('click', handleSignOut);
  }

  if (mobileSignOutButton) {
    mobileSignOutButton.addEventListener('click', handleSignOut);
  }

  function showError(message) {
    console.log("Showing error:", message);
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePassword(password) {
    return password.length >= 6;
  }

  function validateAdditionalFields(userType) {
    switch (userType) {
      case 'public':
        const aadhar = document.getElementById('aadhar').value;
        if (!/^\d{12}$/.test(aadhar)) {
          showError('Aadhar number must be exactly 12 digits. Please enter a valid Aadhar number.');
          return false;
        }
        break;
      case 'staff':
        const username = document.getElementById('username').value;
        const govPin = document.getElementById('govPin').value;
        if (!username) {
          showError('Username is required. Please enter a username.');
          return false;
        }
        if (!/^\d{8}$/.test(govPin)) {
          showError('Government Mandated PIN must be exactly 8 digits. Please enter a valid PIN.');
          return false;
        }
        break;
      case 'official':
        const officialUsername = document.getElementById('username').value;
        const govToken = document.getElementById('govToken').value;
        if (!officialUsername) {
          showError('Username is required. Please enter a username.');
          return false;
        }
        if (!/^[a-zA-Z0-9]{10,}$/.test(govToken)) {
          showError('Government Issued Token must be at least 10 alphanumeric characters. Please enter a valid token.');
          return false;
        }
        break;
    }
    return true;
  }

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Form submitted");

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const userTypeInput = document.getElementById('userType');

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    const userType = userTypeInput ? userTypeInput.value : 'public';

    if (!emailInput) {
      console.error("Email input element not found");
      showError('Email input not found. Please check your HTML.');
      return;
    }

    if (!email) {
      showError('Please enter an email address.');
      return;
    }

    if (!validateEmail(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      showError('Password must be at least 6 characters long.');
      return;
    }

    if (!validateAdditionalFields(userType)) {
      return;
    }

    try {
      if (isSignIn) {
        console.log("Attempting to sign in");
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const idTokenResult = await user.getIdTokenResult(true);
        const userType = idTokenResult.claims.userType || 'public';
        console.log('User signed in successfully. User type:', userType);
      } else {
        console.log("Attempting to sign up");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setUserType(user.uid, userType);
        console.log('User signed up successfully. User type:', userType);
      }
      updateAuthButtons(true);
      closeAuthModal();
      redirectToGetStarted();
    } catch (error) {
      console.error('Authentication error:', error);
      if (isSignIn) {
        if (error.code === 'auth/user-not-found') {
          showError('No account found with this email. Please sign up first.');
        } else if (error.code === 'auth/wrong-password') {
          showError('Incorrect password. Please try again.');
        } else {
          showError('Sign-in failed. Please check your credentials and try again.');
        }
      } else {
        if (error.code === 'auth/email-already-in-use') {
          showError('An account with this email already exists. Please sign in instead.');
          isSignIn = true;
          updateModalContent();
        } else {
          showError('Sign-up failed. Please try again.');
        }
      }
    }
  });

  // Update the auth state change listener
  let initialAuthCheckDone = false;

  auth.onAuthStateChanged((user) => {
    updateAuthButtons(!!user);
    if (!initialAuthCheckDone) {
      initialAuthCheckDone = true;
      const loadingButtons = document.querySelectorAll('#loadingButton, #mobileLoadingButton, #heroLoadingButton');
      loadingButtons.forEach(button => {
        if (button) button.style.display = 'none';
      });
    }
  });

  // Initially hide all buttons except loading
  updateAuthButtons(false);
  const authButtons = document.querySelectorAll('#authButton, #mobileAuthButton, #heroAuthButton');
  const getStartedButtons = document.querySelectorAll('#getStartedButton, #mobileGetStartedButton, #heroGetStartedButton');
  const signOutButtons = document.querySelectorAll('#signOutButton, #mobileSignOutButton');
  
  authButtons.forEach(button => { if (button) button.style.display = 'none'; });
  getStartedButtons.forEach(button => { if (button) button.style.display = 'none'; });
  signOutButtons.forEach(button => { if (button) button.style.display = 'none'; });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded event fired");
  initializeAuth();
});

console.log("register.js loaded");

async function setUserType(userId, userType) {
  console.log(`Setting user type for ${userId} to ${userType}`);
}