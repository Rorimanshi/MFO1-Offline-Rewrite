class Options {
    constructor(){
        this.tools = {
            available: {},
            active: 'default'
        };
        this.layers = {
            available: {},
            active: 'default'
        };
        this.initOptions(this.tools, 'optTools', 't');
        this.initOptions(this.layers, 'optLayers', 'l');

        this.setListeners(this.tools);
        this.setListeners(this.layers);
    }

    initOptions(obj, category, prefix){
        const categoryHandle = document.getElementById(category);
        if(!categoryHandle){
            console.log(`Could not find element of id ${category}!`);
            return;
        }
        const optionsHandle = categoryHandle.querySelectorAll('button');
        optionsHandle.forEach(optionHandle => {
            if(prefix != optionHandle.id.substr(0,1)){
                console.log(`Element that is not od type ${prefix} detected in ${category} category!`);
                return;
            }
            const optionName = optionHandle.id.substr(2);
            if(!optionName.length){
                console.log(`Unnamed option in category ${category}!`);
                return;
            }
            obj.available[optionName] = {
                handle: optionHandle
            };
        });
    }

    setListeners(obj){
        Object.entries(obj.available).forEach(([key,val]) => {
            console.log(val);
            if(val.handle._hasListener) return;
            val.handle.addEventListener('click', e => {
                if(e.target.classList.contains('selected')){
                    e.target.classList.remove('selected');
                    obj.active = 'default';
                }
                else{
                    Object.values(obj.available).forEach(option => {
                        option.handle.classList.remove('selected');
                    });
                    e.target.classList.add('selected');
                    obj.active = key;
                }
                
            });
        });
    }
}