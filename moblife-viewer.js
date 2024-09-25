if (ModAPI.meta) {
    ModAPI.meta.title("MobLife viewer");
    ModAPI.meta.credits("By Oeildelynx");
    ModAPI.meta.icon("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAMxJREFUWEftmFEOgzAMQ9tdYbv/CbcrUITEBzFVPbcMMWR+kzTmYbWhOfGnkJQMcTU/lONitd5qAzXfgpB686vUggF5yc+mhXL5hLian1IKGiwIif4FobZnpnf00OPFdy4hA4ktHrKgLcAbEBL80JOqE+rpItRYEINlQibECLB4zUNYI81DrOFuOoP56fDT3oLYSHoGoUM9xSZE6Q9gTR4yuQUxD/2CkOQpVUCPhyyI2eDyhJoC8WxS3/ab+yG2Jt4HDa05VFzbOG9HaAatZpAZQF8utQAAAABJRU5ErkJggg==");
    ModAPI.meta.description("Mod to see the mobs life in real time.");
}

ModAPI.addEventListener("update", () => {
    let list = ModAPI.mcinstance.$theWorld.$entityList.$toArray0().data;
    list.forEach(element => {
        if (element !== null) {
            if (element.$getHealth) {
                if (!element.$hasCustomName()) {
                    element.$setCustomNameTag(ModAPI.util.str((Math.round(element.$getHealth())/2)+'§c❤'));
                } else {
                    window.test = element
                    let name = ModAPI.util.unstr(element.$getCustomNameTag());
                    if (name.indexOf(' ') > -1) {
                        name = name.slice(0, name.lastIndexOf(" ")+1);
                    } else if (name.indexOf('❤') < 0) {
                        name = name.slice(0, name.length) + " ";
                    } else {
                        name = "";
                    }
                    element.$setCustomNameTag(ModAPI.util.str(name + (Math.round(element.$getHealth())/2)+'§c❤'));
                }
            }
        }
    })
})
