import * as model from './model.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import searchView from './views/searchView.js';
import addRecipeView from './views/addRecipeView.js';
import { async } from 'regenerator-runtime';
import { TIMEOUT_MODAL } from './config.js';

// import 'core-js/stable'
// import 'regenerator-runtime/runtime'
// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    resultsView.update(model.getSearchResultsPerPage());
    await model.loadRecipe(id);
    const { recipe } = model.state;
    // console.log(recipe);
    recipeView.render(recipe);
    bookmarksView.update(model.state.bookmarks);
  } catch (error) {
    recipeView.renderError();
  }
};

const searchRecipes = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    controlPagination();
  } catch (error) {
    throw error;
  }
};

const controlPagination = function (goToPage = 1) {
  // console.log(goToPage);
  resultsView.render(model.getSearchResultsPerPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (servings) {
  model.updateServings(servings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe.bookmarked);
  bookmarksView.render(model.state.bookmarks);

  recipeView.update(model.state.recipe);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    addRecipeView.renderMessage();

    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, TIMEOUT_MODAL * 1000);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (error) {
    console.error('55', error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(searchRecipes);
  paginationView.addHandlerPagination(controlPagination);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
