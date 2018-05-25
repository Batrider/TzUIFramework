var obj = {
    RANDOM_MATCH: 1,  // 随机匹配
    PROPERTY_MATCH: 2,  // 属性匹配
    MAX_PLAYER_COUNT: 2,
    PLAYER_COUNTS: [1, 2, 3],
    COOPERATION: 1,
    COMPETITION: 2,
    GAME_START_EVENT: "gameStart",
    GAME_TIME: "gameTime",
    GAME_OVER_EVENT: "gameOver",

    channel: 'MatchVS',
    platform: 'alpha',

    gameId: 201331,
    gameVersion: 1,
    appKey: '17ffc6d5f1e14a04b99c4bf17addc411',
    secret: '4cc0d042cd5547e98860728bb3207650',

    // gameId: 200757,
    // gameVersion: 1,
    // appKey: '6783e7d174ef41b98a91957c561cf305',
    // secret: 'da47754579fa47e4affab5785451622c',


    gameType: 1,
    matchType: 1,
    tagsInfo: { "title": "A" },
    userInfo: null,
    playerUserIds: [],
    playerSet: new Set(),
    isRoomOwner: false,
    events: {},

    syncFrame: false,
    FRAME_RATE: 20,
    roomId: 0,
    playertime: 180,
    isGameOver: false
};
module.exports = obj;