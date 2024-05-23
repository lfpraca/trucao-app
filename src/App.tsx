import { For, type Component, createSignal, onCleanup, onMount, createResource, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { PlayerData } from "./models/PlayerData";
import backgroundImage from "./assets/img/mesa.png";

const App: Component = () => {
    const [playersData, setPlayersData] = createStore<PlayerData[]>([]);
    const [newName, setNewName] = createSignal("");
    const [inputFocused, setInputFocused] = createSignal(false);

    onMount(async () => {
        const initialPlayers: PlayerData[] = (await (await fetch(window.location.protocol + "//" + window.location.hostname + ":8080/api/players")).json())
            .map((x: string[]) => ({ name: x, bet: 0, actual: 0, lost: 0 }));
        setPlayersData(initialPlayers);
    });

    function handleAddName() {
        if (!newName()) { return; }
        setPlayersData(x => [...x, { name: newName(), bet: 0, actual: 0, lost: 0 }]);
        setNewName("");
    }

    function handleApply() {
        setPlayersData(x => x.map(x => x.bet === x.actual ? x : { ...x, lost: x.lost + 1 }));
        setPlayersData(x => x.map(x => ({ ...x, actual: 0, bet: 0 })));
    }

    function handleReset() {
        setPlayersData(x => x.map(x => ({ ...x, actual: 0, bet: 0, lost: 0 })));
    }

    onMount(() => {
        window.addEventListener("beforeunload", confirmExit);
    });

    onCleanup(() => {
        window.removeEventListener("beforeunload", confirmExit);
    });

    const confirmExit = (event: any) => {
        event.returnValue = "_";
        return "_";
    };

    const getTransformStyle = (index: number, total: number) => {
        const angle = (360 / total) * index;
        const radiusX = 500; // Raio horizontal maior
        const radiusY = 300; // Raio vertical menor
        const x = radiusX * Math.cos((angle * Math.PI) / 180);
        const y = radiusY * Math.sin((angle * Math.PI) / 180);
        return { transform: `translate(${x}px, ${y}px)` };
    };

    return (
        // <div class="bg-gray-700 text-slate-100 min-h-screen text-3xl p-6 relative flex items-center justify-center">
        <div class="min-h-screen text-slate-100 text-3xl p-6 relative flex items-center justify-center"
            style={`background-image: url(${backgroundImage}); background-size: cover; background-position: center;`}>
            <div class="absolute top-3 left-6 flex items-center space-x-2">
                <div class="relative">
                    <input
                        type="text"
                        value={newName()}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        onChange={e => setNewName(e.currentTarget.value)}
                        class="bg-gray-700 border border-slate-300 rounded text-xl p-1 peer"
                    />
                    <label
                        class={`absolute left-2 top-1/4 transform -translate-y-1/2 text-xl transition-all 
                            ${inputFocused() || newName() ? '-translate-y-8 scale-75' : 'translate-y-0 scale-100'} 
                            peer-focus:-translate-y-8 peer-focus:scale-75 text-sky-500`}
                    >
                        Novo
                    </label>
                </div>
                <button onClick={handleAddName} class="bg-sky-500 hover:bg-sky-400 rounded-lg p-2 text-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
            <div class="relative w-full h-full flex items-center justify-center">
                <For each={playersData}>
                    {(x, i) => (
                        <div
                            class="absolute w-60 divide-y divide-sky-500 text-center border-2 border-sky-500 rounded-lg"
                            style={getTransformStyle(i(), playersData.length)}
                        >
                            <div>
                                <button onClick={() => setPlayersData(i(), "lost", x => x - 1)} class="rounded-full w-6 h-6 bg-sky-500 hover:bg-sky-400 text-xl">-</button>
                                <span class="text-red-500 font-bold"> {x.lost}/3 </span>
                                <button onClick={() => setPlayersData(i(), "lost", x => x + 1)} class="rounded-full w-6 h-6 bg-sky-500 hover:bg-sky-400 text-xl">+</button>
                            </div>
                            <div>
                                <span classList={{ "line-through text-red-500": x.lost >= 3 }}>{x.name} </span><button onDblClick={() => setPlayersData(x => x.filter((_, n) => n !== i()))} class="rounded-full w-6 h-6 bg-red-500 hover:bg-red-400 text-xl">x</button>
                            </div>
                            <div>
                                <button onClick={() => setPlayersData(i(), "bet", x => x - 1)} class="rounded-full w-6 h-6 bg-sky-500 hover:bg-sky-400 text-xl">-</button><span class="text-xl"> Faz</span> {x.bet} <button onClick={() => setPlayersData(i(), "bet", x => x + 1)} class="rounded-full w-6 h-6 bg-sky-500 hover:bg-sky-400 text-xl">+</button>
                            </div >
                            <div>
                                <button onClick={() => setPlayersData(i(), "actual", x => x - 1)} class="rounded-full w-6 h-6 bg-sky-500 hover:bg-sky-400 text-xl">-</button><span class="text-xl"> Fez</span> {x.actual} <button onClick={() => setPlayersData(i(), "actual", x => x + 1)} class="rounded-full w-6 h-6 bg-sky-500 hover:bg-sky-400 text-xl">+</button>
                            </div>
                        </div >
                    )}
                </For >
            </div >
            <div class="absolute flex flex-row gap-4 mt-6 justify-center">
                <div class="flex items-center">Tá indo: {playersData.map(x => x.bet).reduce((acc, x) => acc + x, 0)}</div>
                <button onClick={handleApply} class="bg-sky-500 hover:bg-sky-400 rounded-lg p-2 text-xl">Aplicar</button>
                <button onDblClick={handleReset} class="bg-red-500 hover:bg-red-400 rounded-lg p-2 text-xl">Resetar</button>
            </div>
        </div>
    );
};

export default App;
