"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  let hostName = '';
  if (story){
   hostName = story.getHostName();
  }
  return $(`
      <li id="${story.storyId}">
      <i class = "fav"> &#9825;</i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
// search for a match between current story and user favs, if found, add 'red' class to show favs
function highlightFav(story){
  let storyMatch  = currentUser.favorites.find(fav => fav.storyId == story.storyId)
  let currLi  = $allStoriesList.get()[0].lastChild
  if(storyMatch && storyMatch.storyId == currLi.id){
    currLi.firstElementChild.classList.add('red');
  }
}

function addTrashIcon(story){
  let storymatch = currentUser.ownStories.find(own => own.storyId == story.storyId);
  let currLi  = $allStoriesList.get()[0].lastChild;
  if (storymatch && storymatch.storyId == currLi.id){
    let $trash = $('<i class = "trash"> &#128465; </i>')
    let favIcon = currLi.firstElementChild;
    $(favIcon).after($trash)
  }
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
    highlightFav(story);
    addTrashIcon(story);
  }

  $allStoriesList.show();
}

// called when favorites link in navbar is clicked
// loops through "userFavs" instead of all stories to generate markUp
function putFavoritesOnPage(userFavs) {
  $allStoriesList.empty();
  for (let fav of userFavs) {
    const $fav = generateStoryMarkup(fav);
    $allStoriesList.append($fav);
    highlightFav(fav)
  }
  $allStoriesList.show();
}

function putOwnStoriesOnPage(userOwnStories) {
  $allStoriesList.empty();

  for (let ownStory of userOwnStories) {
    const $own = generateStoryMarkup(ownStory);
    $allStoriesList.append($own);
  }
  $allStoriesList.show();
}

async function submitPostForm(event) {
  event.preventDefault();
  const pendingStory = await storyList.addStory(currentUser,
  { title: `${$('#post-title').val()}`, author: `${$('#post-author').val()}`, url: `${$('#post-url').val()}` });
  const story = generateStoryMarkup(pendingStory);
  $allStoriesList.prepend(story);

}

$postForm.on('submit', submitPostForm);


$allStoriesList.on('click', '.fav', favIconClick)
$allStoriesList.on('click', '.trash', trashIconClick)


// when fav Icon is clicked, toggle color change, then use findIndex to match story to one of the user's favs
// if match is found, remove the story from favs, if no match found, add the story to user favs
function favIconClick(evt){
  evt.preventDefault();
  evt.target.classList.toggle('red')
  let storyLi = evt.target.parentElement;
  const indexOfFav = currentUser.favorites.findIndex(function(fav){
    return fav.storyId == `${storyLi.id}`;
  })
  console.log(indexOfFav);
  if (indexOfFav != -1){
    currentUser.removeUserFavorite(currentUser, storyLi.id, indexOfFav)
  }
  else {
    currentUser.addUserFavorite(currentUser, storyLi.id);
  }
}

function trashIconClick(evt){
  evt.preventDefault();
  console.log(evt.target.parentElement.id)
  storyList.removeStory(currentUser, evt.target.parentElement.id)
  evt.target.parentElement.remove();
}