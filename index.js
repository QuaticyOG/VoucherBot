require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ===== REGISTER SLASH COMMAND =====
const commands = [
  {
    name: "vouch",
    description: "Submit a vouch",
    options: [
      {
        name: "text",
        description: "Your vouch message",
        type: 3,
        required: true
      },
      {
        name: "image",
        description: "Screenshot proof",
        type: 11,
        required: true
      }
    ]
  }
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log("✅ Slash command registered");
  } catch (err) {
    console.error(err);
  }
})();

// ===== BOT READY =====
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// ===== INTERACTIONS =====
client.on("interactionCreate", async interaction => {
  try {
    // =========================
    // USER SUBMISSION
    // =========================
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "vouch") {
        const text = interaction.options.getString("text");
        const image = interaction.options.getAttachment("image");

        const reviewChannel =
          interaction.guild.channels.cache.get(
            process.env.REVIEW_CHANNEL
          );

        const embed = new EmbedBuilder()
          .setTitle("📩 New Vouch Submission")
          .setDescription(text)
          .setImage(image.url)
          .setThumbnail(interaction.user.displayAvatarURL())
          .addFields({
            name: "Submitted by",
            value: `${interaction.user} (${interaction.user.tag})`
          })
          .setColor("Yellow")
          .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("approve")
            .setLabel("Approve")
            .setStyle(ButtonStyle.Success),

          new ButtonBuilder()
            .setCustomId("deny")
            .setLabel("Deny")
            .setStyle(ButtonStyle.Danger)
        );

        await reviewChannel.send({
          embeds: [embed],
          components: [row]
        });

        await interaction.reply({
          content: "✅ Your vouch was sent for review.",
          ephemeral: true
        });
      }
    }

    // =========================
    // MOD BUTTONS
    // =========================
    if (interaction.isButton()) {
      // 🔒 check mod role
      if (
        !interaction.member.roles.cache.has(process.env.MOD_ROLE_ID)
      ) {
        return interaction.reply({
          content: "❌ You are not allowed to review vouches.",
          ephemeral: true
        });
      }

      const approvedChannel =
        interaction.guild.channels.cache.get(
          process.env.APPROVED_CHANNEL
        );

      // ===== APPROVE =====
      if (interaction.customId === "approve") {
        const originalEmbed = interaction.message.embeds[0];

        const approvedEmbed = EmbedBuilder.from(originalEmbed)
          .setTitle("🤝🏼 Vouch")
          .setColor("Blue");

        await approvedChannel.send({
          embeds: [approvedEmbed]
        });

        await interaction.message.delete();
        await interaction.reply({
          content: "✅ Vouch approved.",
          ephemeral: true
        });
      }

      // ===== DENY =====
      if (interaction.customId === "deny") {
        await interaction.message.delete();
        await interaction.reply({
          content: "❌ Vouch denied and removed.",
          ephemeral: true
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
});

client.login(process.env.TOKEN);
