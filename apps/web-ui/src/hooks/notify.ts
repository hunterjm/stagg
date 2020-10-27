import { store } from 'react-notifications-component'

export const notify = ({
    title,
    message,
    type,
    duration,
}) => store.addNotification({
    title,
    message,
    type,
    insert: 'bottom',
    container: 'bottom-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration,
      onScreen: true
    }
})
