import { useState } from "react"
import { CaretRight, CaretDown, X } from "phosphor-react"

export const Tabs = {
    Manager: ({ tabs }) => {
        const [activeTab, setActiveTab] = useState(-1)
        // close all tabs
        const closeTab = () => {
            setActiveTab(-1)
        }
        const Content = () => {
            if (activeTab !== -1 && tabs[activeTab]?.content) {
                return (
                    <Tabs.Content>
                        {tabs[activeTab]?.content}
                    </Tabs.Content>
                )
            }
            return null
        }
        return (
            <div>
                <Tabs.List>
                    {tabs.map((tab, index) => {
                        return (
                            <Tabs.Item key={index} isActive={activeTab === index} onClick={() => setActiveTab(index)}>
                                {tab.icon}
                                {tab.label}
                                {activeTab === index ? <X onClick={closeTab} /> : null}
                            </Tabs.Item>
                        )
                    })}
                </Tabs.List>
                <Content />
            </div>
        )
    },
    List: ({ children }) => {
        return (
            <div className="tabs">
                <div className="tabs-header">
                    <div className="tabs-list">
                        {children}
                    </div>
                </div>
            </div>
        )
    },
    Item: ({ children, isActive, onClick }) => {
        return (
            <div className={`tab${isActive ? " active" : ""}`} onClick={onClick}>
                {children}
            </div>
        )
    },
    Header: ({ children }) => {
        return (
            <div className="tabs-header">
                {children}
            </div>
        )
    },
    Content: ({ children }) => {
        return (
            <div className="tab-content">
                {children}
            </div>
        )
    }
}

export default Tabs