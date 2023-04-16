import { createMachine, assign, actions } from 'xstate';
// const createArtRanges = () => {
//     const range_max = 1000000;
//     const range_min = 0;
//     const brackets_limit = Math.floor(Math.random() * 8);
//     const brackets = Array.from(brackets_limit).map(bracket => {

//     }

const artValuator = () => {
    const value_ceiling = 100000;
    const value_floor = 0;
    const bracket_limits = Math.floor(Math.random() * 5);
    return [...bracket_limits].map(bracket_limit => {
        return {
            limit: bracket_limit,
            range: [
                Math.floor(Math.random() * value_ceiling) / bracket_limit,
                Math.floor(Math.random() * value_floor) / bracket_limit,
            ],
        }
    })
}

export default createMachine({
    predictableActionArguments: true,
    id: 'flashCardStateMachine',
    initial: 'welcome',
    context: {
        people: [],
        participants: [],
        art: [],
    },
    states: {
        welcome: {
            on: {
                NEXT: 'lobby',
            },
        },
        lobby: {
            entry: [
                (context) => {
                    const players_min = 4;
                    const participants = [...context.participants];
                    const players = context.participants.filter((participant) => participant.role === "collector").length;
                    const players_missing = players_min - players;
                    if (players_missing) {
                        for (let i = 0; i < players_missing; i++) {
                            participants.push({
                                id: participants.length,
                                name: `Clever AI ${participants.length + 1}`,
                                role: 'collector',
                                type: 'ai',
                            });
                        }
                    }
                    return context.participants = participants;
                },
                (context) => {
                    const art_min = 20;
                    const art = [...context.art];
                    const art_missing = art_min - art.length;
                    if (art_missing) {
                        for (let i = 0; i < art_missing; i++) {
                            art.push({
                                id: art.length,
                                name: `Art ${art.length + 1}`,
                                artist: `Artist ${art.length + 1}`,
                                color: {
                                    r: Math.floor(Math.random() * 255) + 1,
                                    g: Math.floor(Math.random() * 255) + 1,
                                    b: Math.floor(Math.random() * 255) + 1,
                                },
                            });
                        }
                    }
                    return context.art = art;
                }
            ],
            on: {
                BACK: 'welcome',
                NEXT: {
                    target: 'game',
                    cond: (context) => {
                        return context.participants.filter((participant) => participant.role === "collector").length > 0 && context.art.length >= 20
                    }
                },
                ADD: {
                    actions: assign({
                        participants: (context, event) => {
                            console.log(event);
                            const participants = [...context.participants];
                            participants.push({
                                id: participants.length,
                                name: event.name,
                                role: event.role,
                            });
                            return participants;
                        }
                    })
                },
            },
        },
        game: {
            entry: (context) => {
                return true;
            },
            on: {
                // BACK: 'lobby',
                MOVE: {
                    target: 'game',
                    actions: [
                        'game.move',
                    ],
                },
                NEXT: 'summary',
            },
        },
        summary: {
            on: { RESTART: 'lobby' },
        },
    }
});