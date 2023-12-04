export function loadState(key) {
	try {
		const serializedState = localStorage.getItem(key);
		if (serializedState === null) {
			return undefined;
		}
		return JSON.parse(serializedState);
	} catch (err) {
		console.log('Error loading state:', err);
		return undefined;
	}
}

export function saveState(key, state) {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem(key, serializedState);
	} catch (err) {
		console.log('Error saving state:', err);
	}
}

export function deleteState(key) {
	try {
		localStorage.removeItem(key);
	} catch (err) {
		console.log('Error deleting state:', err);
	}
}
