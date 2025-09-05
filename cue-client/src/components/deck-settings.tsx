import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useNotification } from '../hooks/notification-hook';
import { api } from '../api';
import LightButton from './light-button';

export default function DeckSettings({ deckId, belongs }: { deckId: number; belongs: boolean }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { setNotification } = useNotification();
    const modalDivRef = useRef<HTMLDivElement>(null);
    const [modal, setModal] = useState<any>(null);

    useEffect(() => {
        if (modalDivRef.current) {
            const modal = new window.bootstrap!.Modal(modalDivRef.current);
            setModal(modal);
        }
    }, [modalDivRef]);

    const resetProgress = async () => {
        const response = await api(`/decks/${deckId}/progress`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        modal.hide();
        if (response.ok) {
            setNotification('Progress reset.');
        } else {
            setNotification('Could not reset progress.');
        }
    };

    const deleteDeck = async () => {
        modal.hide();
        // @todo: add confirmation dialog

        const response = await api(`/decks/${deckId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            setNotification('Deck deleted.');
            navigate(-1);
        } else {
            setNotification('Could not delete deck.');
        }
    };

    return (
        <div>
            <Link to={`${location.pathname}/study`}>
                <LightButton type="button">
                    <i className="bi bi-eyeglasses"></i>
                </LightButton>
            </Link>{' '}
            {belongs && (
                <>
                    <LightButton
                        id="deckSettingsButton"
                        type="button"
                        onClick={() => {
                            if (modal) {
                                modal.show();
                            }
                        }}
                    >
                        <i className="bi bi-gear-fill"></i>
                    </LightButton>
                    <div
                        ref={modalDivRef}
                        className="modal fade"
                        tabIndex={-1}
                        aria-hidden="true"
                        deck-id="<%= deck.id %>"
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5">Deck Settings</h1>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <form>
                                    <div className="modal-body d-flex flex-column gap-2">
                                        <button
                                            id="resetProgressButton"
                                            className="btn btn-warning w-100"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                resetProgress();
                                            }}
                                        >
                                            Reset Progress
                                        </button>
                                        <a
                                            id="deleteDeckButton"
                                            className="btn btn-danger w-100"
                                            onClick={() => {
                                                deleteDeck();
                                            }}
                                        >
                                            Delete Deck
                                        </a>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-dark" data-bs-dismiss="modal">
                                            Close
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
