function User({name,id}){
    return(
        <>
        <h2>User Num: {id}</h2>
        <div className="container">
            <ul>
                <li>
                    <p>{name}</p>
                </li>
            </ul>
        </div>
        </>
    );
}

export default User;