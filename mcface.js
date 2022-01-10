const Command = require("./pasta"); //Pasta onde fica sua estrutura de comando.

const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js"); //Requisição do Discord.js embed.

module.exports = class extends Command { //Estuturas do comandos.
    constructor(client) {
        super(client, {
            name: "mcface", //Nome do comando.
            description: "Mostra seu rosto ou o rosto de qualquer usuário do Minecraft.", //Descrição do comando.
            options: [
                {
                    name: "nick",
                    type: "STRING", //Opções do comando.
                    description: "Skin.",
                    required: true,
                },
            ],
        });
    }
     //Incialização do comando.  
     run = async(interaction) => {
        let opt = interaction.options.getString("nick"); //Argumentação para conseguir pegar o nome da Skin desejada.

        const Embed = new MessageEmbed() //Variável puxada pela const ("discord.js").

            .setColor("RED")
            .setTitle(`Aqui está a skin de ${opt}!`)
            .setDescription(`> 🧊・Clique [AQUI](https://mc-heads.net/avatar/${opt}) para baixar.`)  //Corpo da Embed.
            .setImage(`https://mc-heads.net/avatar/` + opt);

            await interaction.reply({ content: 'Aqui está a skin desejada.', ephemeral: true });

            interaction.channel.send({ embeds: [Embed]}); //Envia a mensagem em Embed.
            
    };
};