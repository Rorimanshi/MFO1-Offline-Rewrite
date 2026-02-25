class Tools {
    constructor(){
        this.tools = {};
        this.activeTool = 'default';
        this.initTools();
        this.setListeners();
    }

    initTools(){
        const toolbarHandle = document.getElementById('toolbar');
        if(!toolbarHandle){
            console.log(`Could not find toolbar element!`);
            return;
        }
        const toolsHandle = toolbarHandle.querySelectorAll('button');
        toolsHandle.forEach(toolHandle => {
            const prefix = toolHandle.id.substr(0,4);
            if(prefix != 'tool'){
                console.log('Element that is not tool detected in toolbar!');
                return;
            }
            const toolName = toolHandle.id.substr(4);
            if(!toolName.length){
                console.log('Unnamed tool in toolbar!');
                return;
            }
            this.tools[toolName] = {
                handle: toolHandle
            };
        });
    }

    setListeners(){
        Object.entries(this.tools).forEach(([key,val]) => {
            console.log(val);
            if(val.handle._hasListener) return;
            val.handle.addEventListener('click', e => {
                console.log('ff')
                if(e.target.classList.contains('selected')){
                    e.target.classList.remove('selected');
                    this.activeTool = 'default';
                }
                else{
                    Object.values(this.tools).forEach(tool => {
                        tool.handle.classList.remove('selected');
                    });
                    e.target.classList.add('selected');
                    this.activeTool = key;
                }
                
            });
        });
    }

    printTools(){
        Object.entries(this.tools).forEach(([key, val]) => { console.log(key); console.log(val); });
    }
}

class Edition {
    constructor(){
        this.options = {};
        this.activeOption = 'default';

        this.InitOptions();
        this.setListeners();
    }

    InitOptions(){
        const optionsHandle = document.getElementById('edition');
        if(!optionsHandle){
            console.log(`Could not find edition option element!`);
            return;
        }
        const options = optionsHandle.querySelectorAll('button');
        options.forEach(optionHandle => {
            const prefix = optionHandle.id.substr(0,3);
            if(prefix != 'opt'){
                console.log('Element that is not edition option detected in options!');
                return;
            }
            const optionName = optionHandle.id.substr(3);
            if(!optionName.length){
                console.log('Unnamed option in options!');
                return;
            }
            this.options[optionName] = {
                handle: optionHandle
            };
        });
    }

    setListeners(){
        Object.entries(this.options).forEach(([key,val]) => {
            console.log(val);
            if(val.handle._hasListener) return;
            val.handle.addEventListener('click', e => {
                if(e.target.classList.contains('selected')){
                    e.target.classList.remove('selected');
                    this.activeOption = 'default';
                }
                else{
                    Object.values(this.options).forEach(option => {
                        option.handle.classList.remove('selected');
                    });
                    e.target.classList.add('selected');
                    this.activeOption = key;
                }
                
            });
        });
    }
}