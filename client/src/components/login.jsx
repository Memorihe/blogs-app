export const Login = ({ handleLogin, user, handleUser }) => {
    return (
        <form onSubmit={handleLogin}>
            <input name="username" value={user.username} onChange={handleUser} placeholder="username" />
            <input type="password" name="password" value={user.password} onChange={handleUser} placeholder="password" />
            <button type="submit">Login</button>
        </form>
    )
}