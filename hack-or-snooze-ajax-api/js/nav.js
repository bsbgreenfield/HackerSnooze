"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navPost.show();
  $navFavs.show();
  $navOwn.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

$navPost.on('click', navPostClick);

function navPostClick(){
  $postForm.toggleClass('hidden');
}

$navFavs.on('click', navFavsClick);

// initialize the 'on favs tab' to false, and whenever favorites is clicked, it becomes true. If doc reloaded it will be false again
// call putFavoritesOnPage, which is the same as putstoriesonpage but using only favs
let onFavsTab = false;
function navFavsClick(evt){
  if (!onFavsTab){
    evt.preventDefault();
    const userFavs = currentUser.favorites
    putFavoritesOnPage(userFavs);
  }
  else{
    putStoriesOnPage();
  }
  onFavsTab = !onFavsTab;
}

$navOwn.on('click', navOwnClick)
let onOwnTab = false;
function navOwnClick(evt){
  if (!onOwnTab){
    evt.preventDefault();
    const userOwnStories = currentUser.ownStories
    putOwnStoriesOnPage(userOwnStories);
  }
  else{
    putStoriesOnPage();
  }
  onOwnTab = !onOwnTab;
}