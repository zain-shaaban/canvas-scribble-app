interface Player {
    name: string;
    playerID: string;
}


let playersArray: Player[] = [];

const addUser = (name: string,id:string) => {
    playersArray.push({name,playerID:id});
};

const deleteUser=(id:string)=>{
    playersArray=playersArray.filter(ele=>ele.playerID!==id);
}

const getUsers = () => {
  return playersArray;
};
export { addUser, getUsers,deleteUser };
