export const Notification = ({message}) => {
    return (
        <h3 className={message.color}>{message.text}</h3>
    )
}