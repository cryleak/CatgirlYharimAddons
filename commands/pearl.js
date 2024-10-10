const validPickaxeIDs = [278, 285, 257, 274, 270]
let lastUsed = Date.now()


register("command", () => {
    if (Date.now() - lastUsed < 2000) return
    const pearlStack = Player.getInventory().getItems().find(a => a?.getName() == "§fEnder Pearl")
    const pickaxes = Player.getInventory().getItems().filter(a => validPickaxeIDs.includes(a?.getID()))
    if (pickaxes.length > 1) return // If there exists more than one diamond pickaxe in your inventory then a ghost pick probably exists and I don't want to fuck up the command if you are ghost picking with ender pearls
    // No ender pearls in inventory
    if (!pearlStack) {
        ChatLib.command(`gfs ender_pearl 16`, false)
        lastUsed = Date.now()
        return
    }

    const toGive = 16 - pearlStack.getStackSize()
    if (toGive == 0) return
    ChatLib.command(`gfs ender_pearl ${toGive}`, false)
    lastUsed = Date.now()

}).setName("procurepearls")