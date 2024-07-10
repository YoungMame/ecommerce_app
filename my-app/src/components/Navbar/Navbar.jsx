import "./navbar.scss"

export default function Navbar(props) {
    return (
        <>
            <nav>
                Voici la bar de navigation
                {props.children}
            </nav>
        </>
    )
}