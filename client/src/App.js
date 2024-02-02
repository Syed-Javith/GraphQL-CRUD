import logo from './logo.svg';
import './App.css';
import { useMutation, gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

function App() {
  const CREATE_USER = gql`
  mutation CreateUser($firstName: String!, $lastName: String!, $age: Int!) {
    create(firstName: $firstName, lastName: $lastName, age: $age) {
      age
    }
  }
`;
const DELETE_USER = gql`
mutation DeleteUser($id : ID!){
  delete(id : $id){
    id
  }
}
`;
const [createUser] = useMutation(CREATE_USER);
const GET_STUDENTS = gql`
query GetStudents {
  students {
    id
    age
    firstName
    lastName
  }
}
`;
const [users,setUsers] = useState();

const { loading , error, data } = useQuery(GET_STUDENTS,{
  pollInterval : 200
})
if(loading) console.log("loading...");
if(error) console.log(error);
console.log(data?.students);
// setUsers(data?.students)

  const handleCreateUser = async (firstName,lastName,age) => {
    try {
      const { data } = await createUser({
        variables: {
          firstName,
          lastName ,
          age : parseInt(age)
        },
      });
      console.log('User created:', data.create);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await deleteUser({ variables : { id } })
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const [deleteUser] = useMutation(DELETE_USER)

  return (
    
    <div className="App">
      {
        data?.students?.length && data.students.map((user) => {
          return <div key={user.id}>
            <p>
            {user.firstName + " " + user.lastName}
            </p>
            <p>
              {user.age}
            </p>
            <button onClick={() => handleDelete(user.id)}>
              delete
            </button>
            </div>
        })
      }
      <form onSubmit={(e) => {e.preventDefault(); handleCreateUser(e.target.fName.value,e.target.lName.value,e.target.age.value) }}>
        <div>
          <label>First Name</label>
          <input name='fName' id='fName'/>
        </div>
        
        <div>
          <label>Last Name</label>
          <input name='lName' id='lName'/>
        </div>
        
        <div>
          <label>Age</label>
          <input type='number' name='age' id='age'/>
        </div>
         <input type='submit' value={'create'} />
      </form>
      <button onClick={handleCreateUser}>Create</button>
    </div>
  );
}

export default App;
