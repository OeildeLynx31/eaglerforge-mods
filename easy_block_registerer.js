ModAPI.meta.title("Easy block registerer");
ModAPI.meta.description("Add your custom blocks to the game easily");

function registerBlock(blockText, blockName, blockID, textureSrc, customFunction) {
    function fixupBlockIds() {
        var blockRegistry = ModAPI.util.wrap(ModAPI.reflect.getClassById("net.minecraft.block.Block").staticVariables.blockRegistry).getCorrective();
        var BLOCK_STATE_IDS = ModAPI.util.wrap(ModAPI.reflect.getClassById("net.minecraft.block.Block").staticVariables.BLOCK_STATE_IDS).getCorrective();
        blockRegistry.registryObjects.hashTableKToV.forEach(entry => {
            if (entry) {
                var block = entry.value;
                var validStates = block.getBlockState().getValidStates();
                var stateArray = validStates.array || [validStates.element];
                stateArray.forEach(iblockstate => {
                    var i = blockRegistry.getIDForObject(block.getRef()) << 4 | block.getMetaFromState(iblockstate.getRef());
                    BLOCK_STATE_IDS.put(iblockstate.getRef(), i);
                });
            }
        });
    }
    function registerBlockClientSide() {
        var creativeBlockTab = ModAPI.reflect.getClassById("net.minecraft.creativetab.CreativeTabs").staticVariables.tabBlock;
        var itemClass = ModAPI.reflect.getClassById("net.minecraft.item.Item");
        var blockClass = ModAPI.reflect.getClassById("net.minecraft.block.Block");
        var constructor = blockClass.constructors.find(x=>x.length === 1);
        var new_block = constructor(ModAPI.materials.rock.getRef()).$setHardness(-1.0).$setStepSound(blockClass.staticVariables.soundTypeGravel).$setUnlocalizedName(
            ModAPI.util.str(blockName)
        ).$setCreativeTab(creativeBlockTab);

        customFunction(new_block);

        blockClass.staticMethods.registerBlock0.method(
            blockID,
            ModAPI.util.str(blockName),
            new_block
        );
        itemClass.staticMethods.registerItemBlock0.method(new_block);
        ModAPI.mc.renderItem.registerBlock(new_block, ModAPI.util.str(blockName));
        
        
        ModAPI.addEventListener("lib:asyncsink", async () => {
            ModAPI.addEventListener("custom:asyncsink_reloaded", ()=>{
                ModAPI.mc.renderItem.registerBlock(new_block, ModAPI.util.str(blockName));
            });
            AsyncSink.L10N.set(`tile.${blockName}.name`, blockText);
            AsyncSink.setFile(`resourcepacks/AsyncSinkLib/assets/minecraft/models/block/${blockName}.json`, JSON.stringify(
                {
                    "parent": "block/cube_all",
                    "textures": {
                        "all": `blocks/${blockName}`
                    }
                }
            ));
            AsyncSink.setFile(`resourcepacks/AsyncSinkLib/assets/minecraft/models/item/${blockName}.json`, JSON.stringify(
                {
                    "parent": `block/${blockName}`,
                    "display": {
                        "thirdperson": {
                            "rotation": [10, -45, 170],
                            "translation": [0, 1.5, -2.75],
                            "scale": [0.375, 0.375, 0.375]
                        }
                    }
                }
            ));
            AsyncSink.setFile(`resourcepacks/AsyncSinkLib/assets/minecraft/blockstates/${blockName}.json`, JSON.stringify(
                {
                    "variants": {
                        "normal": [
                            { "model": blockName },
                        ]
                    }
                }
            ));
            AsyncSink.setFile(`resourcepacks/AsyncSinkLib/assets/minecraft/textures/blocks/${blockName}.png`, await (await fetch(textureSrc)).arrayBuffer());
        });
    }
    function registerBlockServerSide() {
        function fixupBlockIds() {
            var blockRegistry = ModAPI.util.wrap(ModAPI.reflect.getClassById("net.minecraft.block.Block").staticVariables.blockRegistry).getCorrective();
            var BLOCK_STATE_IDS = ModAPI.util.wrap(ModAPI.reflect.getClassById("net.minecraft.block.Block").staticVariables.BLOCK_STATE_IDS).getCorrective();
            blockRegistry.registryObjects.hashTableKToV.forEach(entry => {
                if (entry) {
                    var block = entry.value;
                    var validStates = block.getBlockState().getValidStates();
                    var stateArray = validStates.array || [validStates.element];
                    stateArray.forEach(iblockstate => {
                        var i = blockRegistry.getIDForObject(block.getRef()) << 4 | block.getMetaFromState(iblockstate.getRef());
                        BLOCK_STATE_IDS.put(iblockstate.getRef(), i);
                    });
                }
            });
        }
        var creativeBlockTab = ModAPI.reflect.getClassById("net.minecraft.creativetab.CreativeTabs").staticVariables.tabBlock;
        var blockClass = ModAPI.reflect.getClassById("net.minecraft.block.Block");
        var itemClass = ModAPI.reflect.getClassById("net.minecraft.item.Item");
        var constructor = blockClass.constructors.find(x=>x.length === 1);
        ModAPI.addEventListener("bootstrap", () => {
            var new_block = constructor(ModAPI.materials.rock.getRef()).$setHardness(-1.0).$setStepSound(blockClass.staticVariables.soundTypeGravel).$setUnlocalizedName(
                ModAPI.util.str(blockName)
            ).$setCreativeTab(creativeBlockTab);

            customFunction(new_block);

            blockClass.staticMethods.registerBlock0.method(
                blockID,
                ModAPI.util.str(blockName),
                new_block
            );
            itemClass.staticMethods.registerItemBlock0.method(new_block);
            fixupBlockIds();
        });
    }
    registerBlockClientSide();
    fixupBlockIds();

    ModAPI.dedicatedServer.appendCode(`
        var blockName = "${blockName}";
        var blockID = ${blockID};
        var customFunction = ${String(customFunction)};
        `);
    ModAPI.dedicatedServer.appendCode(registerBlockServerSide);
}

registerBlock(
    "Block of netherite", // the block name
    "netheriteBlock", // the block ID, must be a string with only letters and numbers, no space
    198, // must be an integer number between 198 and 4098 included
    "https://assets.mcasset.cloud/1.21.3/assets/minecraft/textures/block/netherite_block.png", // a URL or a base64 image
    function(block) {
        block.$blockHardness = 0.5; // you can edit the block generated as you want
    }
)
