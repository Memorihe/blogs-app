export const BlogForm = ({ blog, handleBlog, createBlog }) => {
    return (
        <form onSubmit={createBlog}>
            <input name="title" value={blog.title} onChange={handleBlog} placeholder="title" />
            <input name="author" value={blog.author} onChange={handleBlog} placeholder="author" />
            <input name="url" value={blog.url} onChange={handleBlog} placeholder="url" />
            <button type="submit">create</button>
        </form>
    )
}