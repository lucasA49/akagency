/**
 * @component Button
 * @description Bouton réutilisable avec trois variantes visuelles.
 *
 * @param {'primary'|'secondary'|'ghost'} variant  Style visuel du bouton.
 * @param {'sm'|'md'|'lg'}               size      Taille du bouton.
 * @param {string}                        className Classes additionnelles.
 * @param {ReactNode}                     children  Contenu du bouton.
 * @param {boolean}                       loading   Affiche un spinner si vrai.
 * @param {...any}                        props     Props HTML natifs (<button> ou <a>).
 *
 * @example
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Démarrer un projet
 * </Button>
 */

const VARIANTS = {
  primary:
    'gradient-bg text-white hover:shadow-lg hover:shadow-violet-500/30 hover:scale-105',
  secondary:
    'bg-transparent text-white border border-white/20 hover:border-violet-400/60 hover:bg-white/5 hover:scale-105',
  ghost:
    'bg-transparent text-violet-400 hover:text-white hover:bg-violet-500/10',
};

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  loading = false,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-full
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${className}
      `}
    >
      {loading && (
        <svg
          className="animate-spin w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
