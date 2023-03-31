import React, { useEffect } from 'react';
import resume from './data/resume.json';

export function App() {
    return (
        <div className='app style__letter layout__letter'> 
            <div className='app__header'>
                <h1 className='app__title'>{resume.name}</h1>
                <h2 className='app__subtitle'>{resume.title}</h2>
                <div className='app__contact'>
                    <div className='app__contact-item'>
                        <span className='app__contact-label'>Email:</span>
                        <a className='app__contact-value' href={`mailto:${resume.email}`}>{resume.email}</a>
                    </div>
                    <div className='app__contact-item'>
                        <span className='app__contact-label'>Phone:</span>
                        <a className='app__contact-value' href={`tel:${resume.phone}`}>{resume.phone}</a>
                    </div>
                    {/* GitHub */}
                    {/* LinkedIn */}
                </div>
                {/* Experience */}
                <div className='app__experience'>
                    <h3 className='app__experience-title'>Experience</h3>
                    <div className='app__experience-list'>
                        {resume.experience.map((job, index) => (
                            <div className='app__experience-item' key={index}>
                                <div className='app__experience-item-header'>
                                    <h4 className='app__experience-item-title'>{job.title}</h4>
                                    <div className='app__experience-item-duration'>
                                        <span className='app__experience-item-duration-start'>{job.start}</span>
                                        <span className='app__experience-item-duration-separator'>-</span>
                                        <span className='app__experience-item-duration-end'>{job.end}</span>
                                    </div>
                                </div>
                                <div className='app__experience-item-body'>
                                    <h5 className='app__experience-item-company'>{job.company}</h5>
                                    <p className='app__experience-item-description'>{job.description}</p>
                                </div>
                                {job.highlights && (
                                    <div className='app__experience-item-highlights'>
                                        <h5 className='app__experience-item-highlights-title'>Highlights</h5>
                                        <ul className='app__experience-item-highlights-list'>
                                            {job.highlights.map((highlight, index) => (
                                                <li className='app__experience-item-highlights-item' key={index}>
                                                    {highlight}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Education */}
                {/* Skills */}
                {/* Projects */}
                {/* Interests */}
                
            </div>

        </div>
    );
}