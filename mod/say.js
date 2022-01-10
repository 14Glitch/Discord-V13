const Command = require('../../structures/Command')

const { MessageActionRow, MessageSelectMenu } = require('discord.js')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'falar',
            description: 'Fale o que quiser, mas eu digo por você.',
            options: [
                {
                    name: 'mensagem',
                    type: 'STRING',
                    description: 'A mensagem que será enviada no canal.',
                    required: true
                }
            ]
        })
    }

    run = async (interaction) => {
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) return interaction.reply({ content: 'Você não tem permissão para usar este comando!', ephemeral: true })

        const channels = interaction.guild.channels.cache
            .filter(c => c.type === 'GUILD_TEXT' && c.permissionsFor(this.client.user.id).has(['SEND_MESSAGES', 'EMBED_LINKS']) && c.permissionsFor(interaction.user.id).has('SEND_MESSAGES'))

        if (!channels.size) return interaction.reply({ content: 'Infelizmente não consigo enviar mensagem em nenhum dos canais do servidor. 💔', ephemeral: true })

        const actionRow = new MessageActionRow()
            .addComponents([
                new MessageSelectMenu()
                    .setCustomId('channelSelect')
                    .setPlaceholder('Selecione um canal 📬')
                    .addOptions(
                        channels
                            .map(c => {
                                return {
                                    label: c.name,
                                    value: c.id
                                }
                            })
                    )
            ])

        const reply = await interaction.reply({
            content: '**📥・Onde deseja enviar a mensagem?**',
            components: [actionRow],
            fetchReply: true
        })

        const filter = (i) => i.user.id === interaction.user.id
        const collector = reply.createMessageComponentCollector({ filter, max: 1, time: (3 * 60000) })

        collector.on('collect', (i) => {
            const idCanal = i.values[0]
            const canal = interaction.guild.channels.cache.get(idCanal)

            const texto = interaction.options.getString('mensagem')

            canal.send({ content: texto})
                .then(() => interaction.editReply({ content: `📨・${canal.toString()}`, components: []}))
                .catch(() => interaction.editReply({ content: `❌・${canal.toString()}.`, components: [] }))
        })

        collector.on('end', (collected, reason) => {
            if (reason === 'time') interaction.editReply({ content: 'Tem alguém ai?  🤔\nO tempo de selecionar um canal esgotou.', components: [] })
        })
    }
}