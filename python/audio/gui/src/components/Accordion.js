export function Accordion({ title, children, border = true }) {
    const [isOpen, setIsOpen] = useState(false);

    const styles = {
        accordion: {
            border: border ? '1px solid #ccc' : 'none',
            borderRadius: 4,
            display: "flex",
            flexDirection: "column"
        },
        title: {
            border: 'none',
            borderRadius: 4,
            color: '#333',
            cursor: 'pointer',
            display: 'flex',
            flex: 1,
            fontSize: 16,
            fontWeight: 'bold',
            padding: 10,
            textAlign: 'left',
        },
    };

    return (
        <div className="accordion" style={styles.accordion}>
            <button
                className="accordion__button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div styles={styles.title}>{title}</div>
                {isOpen ? <CaretUp /> : <CaretDown />}
            </button>
            {isOpen && <div className="accordion__content">{children}</div>}
        </div>
    );
}  