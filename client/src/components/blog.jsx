export const Blog = ({blog}) => {
    return (
        <ul>
            <li>Title: {blog.title}</li>
            <li>Author: {blog.author}</li>
            <li>URL: {blog.url}</li>
        </ul>
    )
}