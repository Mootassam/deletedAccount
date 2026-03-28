import React, { useState, useEffect } from 'react';
import Dates from 'src/view/shared/utils/Dates';
import { i18n } from "../../../i18n";

function PrizeModal(props) {
    const { items, number, hideModal, submit } = props;
    const [isSpinning, setIsSpinning] = useState(true);
    const [showPrize, setShowPrize] = useState(false);
    const [glowIntensity, setGlowIntensity] = useState(0);

    const calcule__total = (price, comission) => {
        const total = (parseFloat(comission) / 100) * parseFloat(price);
        return total.toFixed(3);
    };

    useEffect(() => {
        // Start the spinning animation
        const spinTimer = setTimeout(() => {
            setIsSpinning(false);
            setShowPrize(true);
        }, 2000);

        // Glow effect animation
        const glowInterval = setInterval(() => {
            setGlowIntensity(prev => (prev + 1) % 3);
        }, 500);

        return () => {
            clearTimeout(spinTimer);
            clearInterval(glowInterval);
        };
    }, []);

    const getGlowClass = () => {
        const intensities = ['glow-soft', 'glow-medium', 'glow-strong'];
        return intensities[glowIntensity];
    };

    return (
        <div className="prize-modal-overlay" onClick={hideModal}>
            {/* Animated Background Elements */}
            <div className="floating-stars">
                <div className="star star-1">⭐</div>
                <div className="star star-2">✨</div>
                <div className="star star-3">🌟</div>
                <div className="star star-4">⭐</div>
                <div className="star star-5">✨</div>
            </div>

            <div className="sparkle-container">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className={`sparkle-bg sparkle-${i + 1}`}>✨</div>
                ))}
            </div>

            <div className="prize-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className={`prize-modal-content ${getGlowClass()}`}>
                    {/* Close Button */}
                    <button className="modal-close" onClick={hideModal}>
                        <i className="fas fa-times"></i>
                    </button>

                    {/* Header with Trophy */}
                    <div className="prize-header">
                        <div className="trophy-icon">🏆</div>
                        <h2 className="prize-title">{i18n('pages.prizeModal.congratulations')}</h2>
                        <div className="trophy-icon">🏆</div>
                    </div>

                    {/* Spinning Prize Area */}
                    <div className="prize-display-area">
                        {isSpinning ? (
                            <div className="spinning-wheel">
                                <div className="wheel-inner">
                                    <div className="wheel-segment">🏆</div>
                                    <div className="wheel-segment">🎁</div>
                                    <div className="wheel-segment">⭐</div>
                                    <div className="wheel-segment">🎉</div>
                                </div>
                                <div className="spinning-text">{i18n('pages.prizeModal.spinning')}</div>
                            </div>
                        ) : (
                            <div className="prize-reveal">
                                <div className="prize-badge">{i18n('pages.prizeModal.prizeWon')}</div>
                                <div className="prize-item">
                                    <div className="prize-image-frame">
                                        {items?.photo && items?.photo[0]?.downloadUrl ? (
                                            <img
                                                src={items?.photo[0]?.downloadUrl}
                                                alt={items?.title}
                                                className="prize-img"
                                            />
                                        ) : (
                                            <div className="prize-placeholder">
                                                <i className="fas fa-gift"></i>
                                            </div>
                                        )}
                                        <div className="sparkle-effect sparkle-1">✨</div>
                                        <div className="sparkle-effect sparkle-2">✨</div>
                                        <div className="sparkle-effect sparkle-3">✨</div>
                                    </div>
                                    <div className="prize-details">
                                        <h3 className="prize-name">{items?.title || 'Prize'}</h3>
                                        <div className="prize-amount">
                                            <span className="currency">$</span>
                                            {items?.amount || '0.00'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Prize Breakdown */}
                    <div className="prize-card">
                        <div className="prize-row">
                            <span className="prize-label">{i18n('pages.prizeModal.totalAmount')}</span>
                            <span className="prize-value">$ {items?.amount || '0.00'}</span>
                        </div>
                        <div className="prize-row highlight">
                            <span className="prize-label">{i18n('pages.prizeModal.yourWinnings')}</span>
                            <span className="prize-value winner">
                                $ {items?.amount || '0.00'}
                            </span>
                        </div>
                        <div className="prize-row">
                            <span className="prize-label">{i18n('pages.grapModal.orderNumber')}</span>
                            <span className="prize-value">N{number}</span>
                        </div>
                        <div className="prize-row">
                            <span className="prize-label">{i18n('pages.grapModal.orderTime')}</span>
                            <span className="prize-value">{Dates.current()}</span>
                        </div>
                    </div>

                    {/* Commission Box - Added from GrapModal */}
                    <div className="commission-box">
                        <span className="currency-symbol">$</span>
                        <span className="commission-value">
                            {calcule__total(items?.price ?? items?.amount, items?.commission)}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="prize-actions">
                        <button
                            className="btn-claim"
                            onClick={submit}
                            disabled={isSpinning}
                        >
                            <i className="fas fa-gift"></i>
                            {i18n('pages.prizeModal.claimPrize')}
                        </button>
                    </div>

                    {/* Celebration Message */}
                    {showPrize && (
                        <div className="celebration-message">
                            🎉 {i18n('pages.prizeModal.celebrationMessage')} 🎉
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                /* Main Overlay - Full height */
                .prize-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(5px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                /* Floating Stars Animation */
                .floating-stars {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    overflow: hidden;
                }

                .star {
                    position: absolute;
                    font-size: 1.5rem;
                    opacity: 0;
                    color: #0A84FF;
                    animation: floatStar 6s infinite ease-in-out;
                }

                @keyframes floatStar {
                    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.4; }
                    90% { opacity: 0.4; }
                    100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
                }

                .star-1 { left: 5%; animation-delay: 0s; }
                .star-2 { left: 25%; animation-delay: 1.2s; }
                .star-3 { left: 45%; animation-delay: 2.4s; }
                .star-4 { left: 65%; animation-delay: 3.6s; }
                .star-5 { left: 85%; animation-delay: 4.8s; }

                /* Sparkle Background */
                .sparkle-container {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    overflow: hidden;
                }

                .sparkle-bg {
                    position: absolute;
                    font-size: 1rem;
                    color: #0A84FF;
                    opacity: 0.2;
                    animation: sparkleFloat 4s infinite linear;
                }

                @keyframes sparkleFloat {
                    0% { transform: translateY(-10vh) scale(0); opacity: 0; }
                    20% { opacity: 0.2; transform: scale(1); }
                    80% { opacity: 0.2; }
                    100% { transform: translateY(110vh) scale(0); opacity: 0; }
                }

                /* Generate sparkle positions */
                ${Array.from({ length: 12 }).map((_, i) => `
                    .sparkle-${i + 1} {
                        left: ${Math.random() * 100}%;
                        animation-delay: ${Math.random() * 3}s;
                        animation-duration: ${3 + Math.random() * 4}s;
                    }
                `).join('')}

                /* Modal Container - Full height on mobile */
                .prize-modal-container {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 430px;
                    height: 100%;
                    max-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                }

                .prize-modal-content {
                    background: #ffffff;
                    width: 100%;
                    height: 100dvh;
                    max-height: 100dvh;
                    border-radius: 0;
                    padding: 24px 20px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    position: relative;
                    transition: all 0.3s ease;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                }

                /* Desktop styles */
                @media (min-width: 768px) {
                    .prize-modal-container {
                        height: auto;
                        max-height: 90vh;
                        padding: 16px;
                    }
                    
                    .prize-modal-content {
                        height: auto;
                        max-height: 85vh;
                        border-radius: 32px;
                    }
                }

                /* Glow Effects - Blue theme */
                .glow-soft {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 20px rgba(10, 132, 255, 0.2);
                }

                .glow-medium {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 35px rgba(10, 132, 255, 0.35);
                }

                .glow-strong {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 50px rgba(10, 132, 255, 0.5);
                }

                /* Close Button */
                .modal-close {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    background: #f0f0f0;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    color: #1c1c1e;
                    cursor: pointer;
                    z-index: 20;
                    transition: all 0.2s;
                }

                .modal-close:hover {
                    background: #e0e0e0;
                    transform: rotate(90deg);
                }

                /* Prize Header */
                .prize-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin-bottom: 20px;
                    margin-top: 8px;
                    flex-shrink: 0;
                }

                .trophy-icon {
                    font-size: 2.2rem;
                    animation: bounce 1.5s infinite ease-in-out;
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                .prize-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #1c1c1e;
                    margin: 0;
                    letter-spacing: -0.5px;
                }

                /* Spinning Prize Area */
                .prize-display-area {
                    min-height: 220px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                    background: #f8fafd;
                    border-radius: 24px;
                    padding: 20px;
                    flex-shrink: 0;
                }

                .spinning-wheel {
                    text-align: center;
                    width: 100%;
                }

                .wheel-inner {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    animation: spinWheel 1s infinite linear;
                }

                @keyframes spinWheel {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .wheel-segment {
                    font-size: 3rem;
                    filter: drop-shadow(0 0 10px rgba(10, 132, 255, 0.3));
                    animation: segmentPulse 1.5s infinite alternate;
                }

                @keyframes segmentPulse {
                    from { transform: scale(1); }
                    to { transform: scale(1.2); }
                }

                .spinning-text {
                    color: #0A84FF;
                    font-size: 1.1rem;
                    margin-top: 20px;
                    font-weight: 500;
                    animation: textPulse 1.5s infinite;
                }

                @keyframes textPulse {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }

                /* Prize Reveal */
                .prize-reveal {
                    width: 100%;
                }

                .prize-badge {
                    background: #0A84FF;
                    color: white;
                    font-weight: 600;
                    padding: 6px 20px;
                    border-radius: 30px;
                    display: inline-block;
                    margin-bottom: 16px;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .prize-item {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .prize-image-frame {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 2px solid #0A84FF;
                    flex-shrink: 0;
                }

                .prize-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .prize-placeholder {
                    width: 100%;
                    height: 100%;
                    background: #f0f0f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    color: #0A84FF;
                }

                .sparkle-effect {
                    position: absolute;
                    font-size: 1rem;
                    animation: sparkle 1.5s infinite;
                    color: #0A84FF;
                }

                .sparkle-1 { top: -8px; right: -8px; animation-delay: 0s; }
                .sparkle-2 { bottom: -8px; left: -8px; animation-delay: 0.5s; }
                .sparkle-3 { top: 50%; left: -12px; animation-delay: 1s; }

                @keyframes sparkle {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1.2); }
                }

                .prize-details {
                    flex: 1;
                }

                .prize-name {
                    font-size: 1.3rem;
                    color: #1c1c1e;
                    margin: 0 0 8px 0;
                    font-weight: 600;
                }

                .prize-amount {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #0A84FF;
                    display: flex;
                    align-items: center;
                    gap: 2px;
                }

                .currency {
                    font-size: 1.2rem;
                    color: #6c6c70;
                    margin-right: 2px;
                }

                /* Prize Card */
                .prize-card {
                    background: #f8fafd;
                    border-radius: 26px;
                    padding: 16px 18px;
                    margin: 16px 0;
                    border: 0.5px solid rgba(0,0,0,0.02);
                    flex-shrink: 0;
                }

                .prize-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                }

                .prize-row:not(:last-child) {
                    border-bottom: 1px solid #e9ecf0;
                }

                .prize-row.highlight {
                    background: rgba(10, 132, 255, 0.05);
                    margin: 8px -8px;
                    padding: 12px 8px;
                    border-radius: 16px;
                    border-bottom: none;
                }

                .prize-label {
                    font-size: 14px;
                    color: #5e5e60;
                    font-weight: 450;
                }

                .prize-value {
                    font-size: 14px;
                    font-weight: 600;
                    color: #1c1c1e;
                }

                .prize-value.winner {
                    font-size: 1.3rem;
                    color: #0A84FF;
                }

                /* Commission Box - From GrapModal */
                .commission-box {
                display:none;
                    background: #f2f5fa;
                    border-radius: 24px;
                    padding: 12px 20px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: #1c1c1e;
                    border: 0.5px solid rgba(0,0,0,0.02);
                    box-shadow: inset 0 2px 5px rgba(0,0,0,0.02);
                    flex-shrink: 0;
                }

                .currency-symbol {
                    font-size: 1.2rem;
                    font-weight: 500;
                    color: #6c6c70;
                    margin-right: 6px;
                }

                /* Action Buttons */
                .prize-actions {
                    display: flex;
                    justify-content: center;
                    margin-top: auto;
                    padding: 8px 0 16px 0;
                    flex-shrink: 0;
                }

                .btn-claim {
                    background: #0A84FF;
                    border: none;
                    border-radius: 26px;
                    padding: 16px 32px;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 10px 22px -8px rgba(10,132,255,0.3);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    justify-content: center;
                }

                .btn-claim:hover:not(:disabled) {
                    background: #0077e6;
                    transform: scale(1.02);
                }

                .btn-claim:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .btn-claim i {
                    font-size: 1.2rem;
                }

                /* Celebration Message */
                .celebration-message {
                    text-align: center;
                    color: #0A84FF;
                    font-size: 1rem;
                    margin: 8px 0 12px 0;
                    font-weight: 500;
                    animation: slideUp 0.5s ease-out;
                    flex-shrink: 0;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Scrollbar */
                .prize-modal-content::-webkit-scrollbar {
                    width: 4px;
                }
                
                .prize-modal-content::-webkit-scrollbar-thumb {
                    background: #ccc;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
}

export default PrizeModal;
