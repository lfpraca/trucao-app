import { For, type Component, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { PlayerData } from "./models/PlayerData";

const App: Component = () => {
    const [playersData, setPlayersData] = createStore<PlayerData[]>([]);
    const [newName, setNewName] = createSignal("");

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

    return (
        <div class="bg-gray-700 text-slate-100 min-h-screen text-3xl p-6">
            <div class="flex flex-row flex-wrap gap-10 divide-sky-500">
                <For each={playersData}>
                    {(x, i) =>
                        <div class="w-60 divide-y divide-sky-500 text-center border-2 border-sky-500 rounded-lg">
                            <div>
                                <button onClick={() => setPlayersData(i(), "lost", x => x - 1 )} class="rounded-full w-6 h-6 bg-sky-500 hover:bg-sky-400 text-xl">-</button>
                                <span class="text-red-500 font-bold"> {x.lost}/3 </span>
                                <button onClick={() => setPlayersData(i(), "lost", x => x + 1)} class="rounded-full w-6 h-6 bg-sky-500 hover:bg-sky-400 text-xl">+</button>
                            </div>
                            <div>
                                <span classList={{ "line-through text-red-500": x.lost >= 3 }}>{x.name} </span><button onDblClick={() => setPlayersData(x => x.filter((_, n) => n !== i()))} class="rounded-full w-6 h-6 bg-red-500 hover:bg-red-400 text-xl">x</button>
                            </div>
                            <div>
                                <button onClick={() => setPlayersData(i(), "bet", x => x - 1 )} class="rounded-full w-6 h-6 bg-sky-500 hover:bg-sky-400 text-xl">-</button><span class="text-xl"> Faz</span> {x.bet} <button onClick={() => setPlayersData(i(), "bet", x => x + 1)} class="rounded-full w-6 h-6 bg-sky-500 hover:bg-sky-400 text-xl">+</button>
                            </div>
                            <div>
                                <button onClick={() => setPlayersData(i(), "actual", x => x - 1 )} class="rounded-full w-6 h-6 bg-sky-500 hover:bg-sky-400 text-xl">-</button><span class="text-xl"> Fez</span> {x.actual} <button onClick={() => setPlayersData(i(), "actual", x => x + 1 )} class="rounded-full w-6 h-6 bg-sky-500 hover:bg-sky-400 text-xl">+</button>
                            </div>
                        </div>
                    }
                </For>
                <div class="w-60 divide-y divide-sky-500 text-center border-2 border-sky-500 rounded-lg">
                    <div class="p-2 flex-column">
                        <div class="text-2xl">Novo</div>
                        <div>
                            <input type="text" value={newName()} onChange={e => setNewName(e.currentTarget.value)} class="w-[100%] bg-gray-700 border border-slate-300 rounded text-2xl" />
                        </div>
                        <div class="pt-2">
                            <button onClick={handleAddName} class="bg-sky-500 hover:bg-sky-400 rounded-lg p-2 text-xl">Adicionar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-row gap-4 mt-6 justify-center">
                <button onClick={handleApply} class="bg-sky-500 hover:bg-sky-400 rounded-lg p-2 text-xl">Aplicar</button>
                <button onDblClick={handleReset} class="bg-red-500 hover:bg-red-400 rounded-lg p-2 text-xl">Resetar</button>
            </div>
        </div>
    );
};

export default App;
