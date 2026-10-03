import { createPostsService } from "./posts";

const articles = createPostsService("articles");

export const getArticles = articles.list;
export const getArticleById = articles.getById;
export const getArticle = articles.getBySlug;
export const getArticleByGuide = articles.getByGuide;
export const articleSlugExists = articles.slugExists;
export const createArticle = articles.create;
export const updateArticle = articles.update;
export const deleteArticle = articles.remove;
export const incrementArticleViews = articles.incrementViews;
export const incrementArticleLikes = articles.incrementLikes;
export const decrementArticleLikes = articles.decrementLikes;
