import { RcEngine } from './rc-engine';
import { v4 as uuid } from 'uuid';
import { Message } from './rc-events/message';
import { filter, map, tap } from 'rxjs/operators';
import { RoomMessageResponse } from './rc-response/room-message.response';
import { RcApi } from './rc-api';
import { UserInfo } from './api-models/user-info';

const areaEl = document.getElementById("area")!;
const loginEl = document.getElementById("login")!;
const chatEl = document.getElementById("chat")!;
const formBoxEl = document.getElementById("formBox")!;
const boxEl = document.getElementById("box")! as HTMLInputElement;


const groupId = "5yibMGjGXJnqR7GxW";
const username = "jjbenitez026@gmail.com";
const user = "admin";
const password = "12345";
let messages: Array<Message> = [];
let isLoadingOnTop = false;
let me: UserInfo|undefined = undefined;

const engine = new RcEngine('ws://192.168.48.4:3000/websocket');
engine.open();

const api = new RcApi('http://192.168.48.4:3000/api/v1');

loginEl.addEventListener('click', async () => {
    await startupChatWindow();
});

chatEl.addEventListener('scroll', async (e) => {
    const el = (e.target as HTMLElement);

    if (el.scrollTop < 10 && !isLoadingOnTop) {
        isLoadingOnTop = true;

        const curScrollPos = el.scrollTop;
        const oldScroll = el.scrollHeight - el.clientHeight;

        await loadMoreMessages();

        const newScroll = el.scrollHeight - el.clientHeight;
        el.scrollTop = curScrollPos + (newScroll - oldScroll);
    }
});

formBoxEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    await sendMessage();
});

export const login = async () => {
    const r = await engine.login(username, password);
    const { id, token } = r.result;

    // get me
    api.token = token;
    api.userId = id;

    const _me = await api.me();
    if (_me.success) {
        me = _me;
    }

    areaEl.style.display = 'inline';
    loginEl.style.display = 'none';
}

export const sendMessage = async () => {
    const id = `${engine.session}_${uuid()}`;
    const msg = boxEl.value;
    boxEl.value = '';

    writeLocalMessage(id, msg);

    if (msg.length > 0) {
        const _msg = await engine.sendPlainMessage(msg, groupId, id);
        messages = messages.map(m => (m._id === _msg.id && true === m.local) ? _msg?.result : m);
    }

    writeMessages();
}

export const writeLocalMessage = (id: string, msg: string) => {
    const _msg = { _id: id, msg, local: true, u: {_id: undefined, name: me?.name, username: me?.username} } as Message;

    messages = [
        ...messages,
        _msg
    ];

    writeMessages();
}

export const groupSubscribe = async () => {
    const id = uuid();
    await engine.subscribeToGroup(groupId, id);

    engine.bus$
        .pipe(
            filter(r => engine.isGroupMessage(r, groupId)),
            map(r => (r as RoomMessageResponse)?.fields?.args),
            tap(msgs => {
                messages = [
                    ...messages,
                    ...msgs.filter(m => !m._id?.startsWith(engine.session))
                ];

                const _isBottom = isBottom(chatEl);
                writeMessages();

                if (_isBottom) {
                    scrollToBottom();
                }
            })
        )
        .subscribe();
}

export const loadHistory = async (after: number, before: number | null) => {
    return engine.loadGroupHistory(groupId, before, after, 50);
}

export const startupChatWindow = async () => {
    await login();
    await groupSubscribe();

    const r = await loadHistory(Date.now(), null);
    messages = [...r.result.messages.reverse()];

    writeMessages();
    scrollToBottom();
}

export const loadMoreMessages = async () => {
    const lastMessageTime = messages[0]?.ts?.$date ?? null;
    const r = await loadHistory(Date.now(), lastMessageTime);

    messages = [
        ...r.result?.messages?.reverse(),
        ...messages
    ];

    writeMessages();
    isLoadingOnTop = false;
}

export const writeMessages = () => {
    if (chatEl) {
        chatEl.innerHTML = '';

        for (const m of messages) {
            if (m) {
                chatEl.innerHTML = `${chatEl?.innerHTML}
<div class="msg ${true === m.local ? 'opaque' : ''}">${m?.u?.username}: ${m?.msg}</div>
`
            }
        }
    }
}

export const scrollToBottom = () => {
    chatEl?.scroll({ top: chatEl.scrollHeight });
};

export const isBottom = (el: HTMLElement) => {
    const { scrollHeight, scrollTop, clientHeight } = el;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    return distanceFromBottom < 5;
}
