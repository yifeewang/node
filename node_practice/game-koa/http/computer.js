module.exports = function(playerAction) {
    if(['rock', 'paper', 'scissor'].indexOf(playerAction) === -1) {
        throw new Error('invalid playerAction')
    }
    let computerAction
    const random = Math.random() * 3
    if(random < 1) {
        computerAction = 'rock'
    } else if (random > 2) {
        computerAction = 'paper'
    } else {
        computerAction = 'scissor'
    }

    if(computerAction === playerAction) {
        return 0
     }else if(
        computerAction === 'rock' && playerAction === 'paper' ||
        computerAction === 'paper' && playerAction === 'scissor' ||
        computerAction === 'scissor' && playerAction === 'rock'
    ) {
        return 1
    } else {
        return -1
    }
}