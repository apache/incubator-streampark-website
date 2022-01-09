// Toast.js

let ToastWrap = null
let count = 0

function Toast (props) {
    if (!ToastWrap) {
        // 单利模式
        ToastWrap = document.createElement('div')
        ToastWrap.setAttribute('class', 'cpt-toast-wrapper')
        document.body.append(ToastWrap)
    }
    let id = '' + Date.now() + count++
    let toast = document.createElement('div')
    toast.setAttribute('id', id)
    toast.innerHTML = `<div class="cpt-toast"><span class="${props.icon}">${props.msg}</span></div>`
    ToastWrap.append(toast)
    setTimeout(() => {
        document.getElementById(id).remove()
    }, props.time || 1000);
}

export default {
    success(msg, time) { Toast({ msg, time, icon: 'success' }) },
    error(msg, time) { Toast({ msg, time, icon: 'error' }) },
    info(msg, time) { Toast({ msg, time, icon: 'info' }) }
}

