export default function StatusMessage({feedback}) {
      // Status message uses gray instead of purple
      let statusMsg = '';

      if (feedback && feedback.accuracy !== undefined) {
        if (feedback.accuracy === 100) {
          statusMsg = "Magnifique! C'est parfait! 🥖🇫🇷";
        } else if (feedback.accuracy >= 80) {
          statusMsg = "Très bien! Presque parfait!";
        } else if (feedback.accuracy >= 50) {
          statusMsg = "Pas mal, mais tu peux faire mieux! 🍷";
        } else {
          statusMsg = "Ooh là là... On recommence, d'accord?";
        }
      }

    return (
        <div className="mb-6 text-gray-800 font-semibold text-base text-center transition-all duration-200 min-h-[1.5em]">
            {statusMsg}
        </div>
    );
}
