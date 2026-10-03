import { createPostsService } from './posts'

const blogs = createPostsService('blogs')

export const getBlogs = blogs.list
export const getBlogById = blogs.getById
export const getBlog = blogs.getBySlug
export const blogSlugExists = blogs.slugExists
export const createBlog = blogs.create
export const updateBlog = blogs.update
export const deleteBlog = blogs.remove
export const incrementBlogViews = blogs.incrementViews
