// Importing Kinde Authentication SDK
import createKindeClient from "@kinde-oss/kinde-auth-pkce-js";

// Make a switch views (logged in and logged out views)
const loggedInViews = document.getElementsByClassName("js-logged-in-view");
const loggedOutViews = document.getElementsByClassName("js-logged-out-view");


// Switchviews Functions
// to hide the opposing Views when not activated
const switchViews = (a, b) => {
    [...a].forEach((v) => v.removeAttribute("hidden"));
    [...b].forEach((v) => v.setAttribute("hidden", true));
};

// Render Logged In View Function
const renderLoggedInView = (user) => {
    // Identify the class
    const namePlaceholder = document.querySelector(".js-user-name");
    const avatarPlaceholder = document.querySelector(".js-user-avatar");
    const avatarPicturePlaceholder = document.querySelector(
        ".js-user-avatar-picture"
    );
    // username textContent
    namePlaceholder.textContent = `${user.given_name} ${user?.family_name || ""}`;

    // users avatar picture
    if (`${user.picture}` != "") {
        avatarPicturePlaceholder.src = `${user.picture}`;
        avatarPicturePlaceholder.removeAttribute("hidden");
    } else {
        avatarPlaceholder.textContent = `${user.given_name[0]}${
        user?.family_name?.[0] || user.given_name[1]
      }`;
        avatarPlaceholder.removeAttribute("hidden");
    }
    // Switch the Views
    switchViews(loggedInViews, loggedOutViews);
};

// render Logged Out View function
const renderLoggedOutView = () => {
    const loggedInViews = document.getElementsByClassName("js-logged-in-view");
    const loggedOutViews = document.getElementsByClassName("js-logged-out-view");
    switchViews(loggedOutViews, loggedInViews);
    localStorage.clear(); // Clears all data from local storage
};

// render the users for views
const render = async (user) => {
    if (user) {
        renderLoggedInView(user);
    } else {
        renderLoggedOutView();
    }
};

// Activate Kinde Authorization
const kinde = await createKindeClient({
    client_id: import.meta.env.VITE_KINDE_CLIENT_ID,
    domain: import.meta.env.VITE_KINDE_DOMAIN,
    redirect_uri: import.meta.env.VITE_KINDE_REDIRECT_URL,
    is_dangerously_use_local_storage: true,
    on_redirect_callback: (user, appState) => {
        console.log({
            user,
            appState
        });
        if (user) {
            renderLoggedInView(user);
        } else {
            renderLoggedOutView();
        }
    },
});


// Kinde Event when Click
const addKindeEvent = (id) => {
    document.getElementById(id).addEventListener("click", async () => {
        await kinde[id]();
    });
};
["login", "register", "logout"].forEach(addKindeEvent);

// Handle page load
const user = await kinde.getUser();
await render(user);