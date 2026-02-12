// sw.js

// Evento 'message': Ouve as mensagens enviadas pela página principal.
self.addEventListener('message', event => {
    // Verifica se a mensagem é para mostrar uma notificação.
    if (event.data && event.data.type === 'show-notification') {
        const { title, body, tag } = event.data.payload;
        // Exibe a notificação. O Service Worker faz isso para que a notificação
        // possa ser gerenciada mesmo que a aba do site não esteja em foco.
        self.registration.showNotification(title, {
            body: body,
            icon: 'img/logo-hxh.png', // Ícone da notificação
            vibrate: [200, 100, 200], // Padrão de vibração para celulares
            tag: tag // Uma tag para agrupar ou substituir notificações
        });
    }
});

// Evento 'notificationclick': Disparado quando o usuário clica na notificação.
self.addEventListener('notificationclick', event => {
    // Fecha a notificação.
    event.notification.close();

    // Define a URL que deve ser aberta ao clicar.
    // Neste caso, a página principal com um parâmetro para ir direto para a seção de perfil.
    const urlToOpen = new URL('./index.html?section=profile', self.location.origin).href;

    // Procura por uma janela do site que já esteja aberta.
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientsArr => {
            // Se uma janela for encontrada, foca nela e navega para a URL desejada.
            const client = clientsArr.find(c => c.url.includes('index.html'));
            if (client) {
                return client.navigate(urlToOpen).then(c => c.focus());
            }
            // Se nenhuma janela do site estiver aberta, abre uma nova.
            return clients.openWindow(urlToOpen);
        })
    );
});